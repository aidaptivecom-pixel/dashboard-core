"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { 
  Inbox, 
  FolderOpen, 
  CheckCircle2, 
  Circle, 
  Target, 
  ArrowRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useSpaces } from "@/hooks/useSpaces";
import { useCaptures } from "@/hooks/useCaptures";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

// Tremor components
import {
  Card,
  Metric,
  Text,
  Title,
  Flex,
  Grid,
  ProgressBar,
  List,
  ListItem,
  Badge,
  Divider,
} from "@tremor/react";

export default function TremorTestPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");

  const { profile } = useProfile();
  const { spaces } = useSpaces();
  const { unprocessedCount } = useCaptures();
  const { activeGoals } = useGoals();
  const { tasks, toggleTask } = useTasks();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })
      );
      const hour = now.getHours();
      if (hour < 12) setGreeting("Buenos días");
      else if (hour < 18) setGreeting("Buenas tardes");
      else setGreeting("Buenas noches");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTask = async (id: string) => {
    await toggleTask(id);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => !t.due_date || t.due_date === today);
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const taskProgress =
    todayTasks.length > 0
      ? Math.round((completedTasks / todayTasks.length) * 100)
      : 0;

  const goalsProgress =
    activeGoals.length > 0
      ? Math.round(
          activeGoals.reduce((acc, g) => acc + (g.progress || 0), 0) /
            activeGoals.length
        )
      : 0;

  const userName = profile?.name?.split(" ")[0] || "Usuario";

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Flex alignItems="start" justifyContent="start" className="gap-2 mb-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <Text className="text-gray-500">
              {currentTime} ·{" "}
              {new Date().toLocaleDateString("es", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </Flex>
          <Title className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {greeting}, {userName}
          </Title>
        </div>

        {/* Metrics Grid */}
        <Grid numItemsSm={2} numItemsLg={4} className="gap-4 mb-8">
          {/* En captura */}
          <Card decoration="top" decorationColor="blue" className="hover:shadow-md transition-shadow">
            <Flex alignItems="center" justifyContent="start" className="gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Inbox className="h-5 w-5 text-blue-600" />
              </div>
              {unprocessedCount > 0 && (
                <Badge color="blue" size="xs">
                  Nuevo
                </Badge>
              )}
            </Flex>
            <Metric className="text-gray-900 dark:text-gray-100">{unprocessedCount}</Metric>
            <Text className="text-gray-500">En captura</Text>
            <Link href="/capture" className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              Ver inbox <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* Tareas hoy */}
          <Card decoration="top" decorationColor="emerald" className="hover:shadow-md transition-shadow">
            <Flex alignItems="center" justifyContent="start" className="gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </Flex>
            <Metric className="text-gray-900 dark:text-gray-100">
              {completedTasks}/{todayTasks.length}
            </Metric>
            <Text className="text-gray-500">Tareas hoy</Text>
            <ProgressBar value={taskProgress} color="emerald" className="mt-3" />
          </Card>

          {/* Espacios */}
          <Card decoration="top" decorationColor="violet" className="hover:shadow-md transition-shadow">
            <Flex alignItems="center" justifyContent="start" className="gap-3 mb-3">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                <FolderOpen className="h-5 w-5 text-violet-600" />
              </div>
            </Flex>
            <Metric className="text-gray-900 dark:text-gray-100">{spaces.length}</Metric>
            <Text className="text-gray-500">Espacios</Text>
            <Flex className="mt-3 gap-1">
              {spaces.slice(0, 5).map((s) => (
                <span key={s.id} className="text-lg">
                  {s.icon}
                </span>
              ))}
            </Flex>
          </Card>

          {/* Metas activas */}
          <Card decoration="top" decorationColor="orange" className="hover:shadow-md transition-shadow">
            <Flex alignItems="center" justifyContent="between" className="mb-3">
              <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <Badge color="orange" size="xs">
                {goalsProgress}% avg
              </Badge>
            </Flex>
            <Metric className="text-gray-900 dark:text-gray-100">{activeGoals.length}</Metric>
            <Text className="text-gray-500">Metas activas</Text>
            <Link href="/goals" className="mt-3 flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700">
              Ver metas <ArrowRight className="h-3 w-3" />
            </Link>
          </Card>
        </Grid>

        {/* Main Content Grid */}
        <Grid numItemsSm={1} numItemsLg={3} className="gap-6">
          {/* Espacios List - 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <Title className="mb-4">
                <Flex alignItems="center" className="gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Espacios
                </Flex>
              </Title>
              <Grid numItemsSm={1} numItemsMd={2} className="gap-3">
                {spaces.map((space) => (
                  <Link key={space.id} href={`/spaces/${space.id}`}>
                    <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <Flex alignItems="center" justifyContent="start" className="gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                          style={{ backgroundColor: `${space.color}20` }}
                        >
                          {space.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {space.name}
                          </Text>
                          <Text className="text-gray-500 text-xs truncate">
                            {space.description || "Sin descripción"}
                          </Text>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </Flex>
                    </Card>
                  </Link>
                ))}
                {spaces.length === 0 && (
                  <div className="col-span-2 text-center py-8">
                    <Text className="text-gray-500">No hay espacios creados</Text>
                  </div>
                )}
              </Grid>
            </Card>
          </div>

          {/* Sidebar - Tasks & Goals */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <Card>
              <Title className="mb-4">Tareas de hoy</Title>
              <List>
                {todayTasks.slice(0, 5).map((task) => {
                  const space = spaces.find((s) => s.id === task.space_id);
                  return (
                    <ListItem key={task.id}>
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={cn(
                          "w-full flex items-center gap-3 text-left py-1",
                          task.completed && "opacity-60"
                        )}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 flex-shrink-0 hover:text-blue-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <Text
                            className={cn(
                              "truncate",
                              task.completed && "line-through text-gray-400"
                            )}
                          >
                            {task.title}
                          </Text>
                          {space && (
                            <Text className="text-xs text-gray-400">
                              {space.icon} {space.name}
                            </Text>
                          )}
                        </div>
                      </button>
                    </ListItem>
                  );
                })}
                {todayTasks.length === 0 && (
                  <div className="text-center py-6">
                    <Text className="text-gray-500">No hay tareas para hoy</Text>
                    <Link href="/goals" className="text-blue-600 text-sm hover:underline">
                      Crear una tarea
                    </Link>
                  </div>
                )}
              </List>
            </Card>

            {/* Goals */}
            <Card>
              <Flex alignItems="center" justifyContent="between" className="mb-4">
                <Title>Metas activas</Title>
                <Link href="/goals" className="text-xs text-blue-600 hover:underline">
                  Ver todas
                </Link>
              </Flex>
              <div className="space-y-3">
                {activeGoals.slice(0, 3).map((goal) => {
                  const space = spaces.find((s) => s.id === goal.space_id);
                  return (
                    <div key={goal.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <Flex alignItems="center" className="gap-2 mb-2">
                        <span className="text-lg">{space?.icon || "🎯"}</span>
                        <Text className="font-medium truncate flex-1">{goal.title}</Text>
                        <Badge color="gray" size="xs">
                          {goal.progress || 0}%
                        </Badge>
                      </Flex>
                      <ProgressBar
                        value={goal.progress || 0}
                        color="blue"
                        className="h-1.5"
                      />
                    </div>
                  );
                })}
                {activeGoals.length === 0 && (
                  <div className="text-center py-6">
                    <Text className="text-gray-500">No hay metas activas</Text>
                    <Link href="/goals" className="text-blue-600 text-sm hover:underline">
                      Crear una meta
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Grid>

        {/* Footer note */}
        <Divider />
        <Text className="text-center text-gray-400 text-sm">
          Esta es una página de prueba usando{" "}
          <a href="https://tremor.so" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
            Tremor
          </a>
          . Compará con la{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            página principal
          </Link>
          .
        </Text>
      </div>
    </MainLayout>
  );
}
