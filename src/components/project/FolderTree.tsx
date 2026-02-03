'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronRight, ChevronDown, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Folder as FolderData } from '@/hooks/useFolders';

interface FolderTreeProps {
  folders: FolderData[];
  currentFolderId: string | null;
  onFolderSelect: (folderId: string | null, folder?: FolderData) => void;
  onNewFolder?: () => void;
  spaceName?: string;
  loading?: boolean;
}

interface TreeNode extends FolderData {
  children: TreeNode[];
  depth: number;
}

export function FolderTree({
  folders,
  currentFolderId,
  onFolderSelect,
  onNewFolder,
  spaceName = 'Raíz',
  loading = false,
}: FolderTreeProps) {
  // Track which folders are expanded
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Build tree structure from flat folder list
  const tree = useMemo(() => {
    const folderMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: create TreeNode for each folder
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [], depth: 0 });
    });

    // Second pass: build parent-child relationships
    folders.forEach(folder => {
      const node = folderMap.get(folder.id)!;
      if (folder.parent_id && folderMap.has(folder.parent_id)) {
        const parent = folderMap.get(folder.parent_id)!;
        parent.children.push(node);
      } else {
        rootNodes.push(node);
      }
    });

    // Third pass: calculate depths
    const setDepths = (nodes: TreeNode[], depth: number) => {
      nodes.forEach(node => {
        node.depth = depth;
        if (node.children.length > 0) {
          setDepths(node.children, depth + 1);
        }
      });
    };
    setDepths(rootNodes, 0);

    // Sort children by name
    const sortNodes = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(node => {
        if (node.children.length > 0) {
          sortNodes(node.children);
        }
      });
    };
    sortNodes(rootNodes);

    return rootNodes;
  }, [folders]);

  // Find path to current folder and auto-expand parents
  useEffect(() => {
    if (!currentFolderId) return;

    const findPathToFolder = (nodes: TreeNode[], targetId: string, path: string[] = []): string[] | null => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return path;
        }
        if (node.children.length > 0) {
          const result = findPathToFolder(node.children, targetId, [...path, node.id]);
          if (result) return result;
        }
      }
      return null;
    };

    const pathToFolder = findPathToFolder(tree, currentFolderId);
    if (pathToFolder) {
      setExpandedFolders(prev => {
        const next = new Set(prev);
        pathToFolder.forEach(id => next.add(id));
        return next;
      });
    }
  }, [currentFolderId, tree]);

  const toggleExpand = useCallback((folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const renderNode = useCallback((node: TreeNode) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = currentFolderId === node.id;
    const hasChildren = node.children.length > 0;
    const paddingLeft = 12 + node.depth * 16;

    return (
      <div key={node.id}>
        <button
          onClick={() => onFolderSelect(node.id, node)}
          className={cn(
            'w-full flex items-center gap-2 py-1.5 pr-3 rounded-lg text-sm transition-all text-left group',
            isSelected
              ? 'bg-primary/10 text-primary font-medium'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {/* Expand/collapse button */}
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-accent/50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4.5" /> // Spacer for alignment
          )}

          {/* Folder icon */}
          <Folder
            className={cn(
              'h-4 w-4 flex-shrink-0 transition-colors',
              isSelected ? 'text-primary' : 'text-yellow-500'
            )}
          />

          {/* Folder name */}
          <span className="truncate flex-1">{node.name}</span>

          {/* Child count badge */}
          {hasChildren && !isExpanded && (
            <span className="text-xs text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
              {node.children.length}
            </span>
          )}
        </button>

        {/* Children */}
        <AnimatePresence initial={false}>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {node.children.map(child => renderNode(child))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, [expandedFolders, currentFolderId, onFolderSelect, toggleExpand]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Cargando carpetas...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tree content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {/* Root folder */}
        <button
          onClick={() => onFolderSelect(null)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all text-left',
            currentFolderId === null
              ? 'bg-primary/10 text-primary font-medium'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          )}
        >
          <Home className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{spaceName}</span>
        </button>

        {/* Folder tree */}
        <div className="mt-1">
          {tree.map(node => renderNode(node))}
        </div>

        {/* Empty state */}
        {folders.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Sin carpetas
          </p>
        )}
      </div>

      {/* New folder button */}
      {onNewFolder && (
        <div className="p-2 border-t border-border">
          <button
            onClick={onNewFolder}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-all border border-dashed border-border"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva carpeta</span>
          </button>
        </div>
      )}
    </div>
  );
}
