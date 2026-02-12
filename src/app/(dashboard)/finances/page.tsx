"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CircleDollarSign,
  Plus,
  Pencil,
  Paperclip,
  Settings,
  X,
  Filter,
} from "lucide-react";
import {
  useFinances,
  getItemStatus,
  type UnifiedItem,
  type ItemType,
  type StatusFilter,
  type SortField,
  type Category,
  type Payment,
} from "@/hooks/useFinances";

/* ─── Constants ─── */
const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const CATEGORY_COLORS: Record<string, string> = {
  alquiler:"#3B82F6",salario:"#8B5CF6",servicios:"#06B6D4",impuestos:"#F59E0B",
  hosting:"#10B981",tarjetas:"#EC4899",comida:"#F97316",transporte:"#6366F1",otros:"#94A3B8",
};

const PRESET_COLORS = ["#3B82F6","#8B5CF6","#06B6D4","#F59E0B","#10B981","#EC4899","#F97316","#6366F1","#EF4444","#94A3B8"];

const PAYMENT_METHODS = ["efectivo","tarjeta","transferencia","crypto"];
const ENTITIES = ["personal","igreen","aidaptive"];
const ENTITY_COLORS: Record<string,{bg:string;text:string}> = {
  personal:{bg:"bg-zinc-500/10",text:"text-zinc-400"},
  igreen:{bg:"bg-green-500/10",text:"text-green-400"},
  aidaptive:{bg:"bg-violet-500/10",text:"text-violet-400"},
};

const TYPE_COLORS = {
  expense:{bg:"bg-rose-500/10",text:"text-rose-400",border:"border-rose-500/20"},
  debt:{bg:"bg-amber-500/10",text:"text-amber-400",border:"border-amber-500/20"},
  income:{bg:"bg-emerald-500/10",text:"text-emerald-400",border:"border-emerald-500/20"},
};
const TYPE_LABELS: Record<string,string> = {expense:"Gasto",debt:"Deuda",income:"Ingreso"};
const TYPE_SHORT: Record<string,string> = {expense:"G",debt:"D",income:"I"};

const STATUS_CONFIG = {
  paid:   {emoji:"✅",label:"Pagado",  cls:"bg-emerald-500/10 text-emerald-400"},
  ontime: {emoji:"🟡",label:"A tiempo",cls:"bg-yellow-500/10 text-yellow-400"},
  overdue:{emoji:"🔴",label:"Vencido", cls:"bg-rose-500/10 text-rose-400"},
  upcoming:{emoji:"⏳",label:"Próximo", cls:"bg-sky-500/10 text-sky-400"},
};

/* ─── Helpers ─── */
function fmt(n:number,cur?:string){
  if(cur==="USD") return `US$ ${n.toLocaleString("es-AR",{maximumFractionDigits:0})}`;
  return `$ ${n.toLocaleString("es-AR",{maximumFractionDigits:0})}`;
}
function fmtShort(n:number,cur?:string){
  const prefix = cur==="USD"?"US$ ":"$ ";
  if(n>=1_000_000) return `${prefix}${(n/1_000_000).toFixed(1).replace(".0","")}M`;
  if(n>=1_000) return `${prefix}${(n/1_000).toFixed(0)}k`;
  return `${prefix}${n.toLocaleString("es-AR",{maximumFractionDigits:0})}`;
}
function fmtARS(n:number){return fmt(n);}
function fmtDate(d:string|null|undefined){
  if(!d) return "—";
  return new Date(d+"T00:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"short"});
}

/* ─── Editable Dollar ─── */
function EditableDollar({value,onChange}:{value:number;onChange:(v:number)=>void}){
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(String(value));

  const commit=()=>{
    const n=Number(draft.replace(/\D/g,""));
    if(n>0) onChange(n);
    setEditing(false);
  };

  if(editing) return (
    <span className="inline-flex items-center gap-1">
      <span className="text-sm text-muted-foreground">Dólar blue: $</span>
      <input
        className="bg-transparent border-b border-primary text-sm font-medium w-20 outline-none"
        value={draft}
        autoFocus
        onChange={e=>setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}}
      />
    </span>
  );

  return (
    <button onClick={()=>{setDraft(String(value));setEditing(true);}} className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
      Dólar blue: {fmtARS(value)} ✏️
    </button>
  );
}

/* ─── Payment History Section (inside edit modal) ─── */
function PaymentHistory({
  item,
  onAddPayment,
}:{
  item: UnifiedItem;
  onAddPayment: (amount:number, date:string, method:string, notes?:string) => Promise<void>;
}){
  const [showForm, setShowForm] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState(new Date().toISOString().split("T")[0]);
  const [payMethod, setPayMethod] = useState("transferencia");
  const [payNotes, setPayNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const totalAmount = item.type === "debt" ? (item.rawItem as { total_amount: number }).total_amount : item.amount;
  const remaining = totalAmount - item.totalPaid;
  const progress = totalAmount > 0 ? Math.min((item.totalPaid / totalAmount) * 100, 100) : 0;

  const handleAdd = async () => {
    if (!payAmount || Number(payAmount) <= 0) return;
    setSaving(true);
    await onAddPayment(Number(payAmount), payDate, payMethod, payNotes || undefined);
    setPayAmount("");
    setPayNotes("");
    setShowForm(false);
    setSaving(false);
  };

  const inputCls = "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";

  return (
    <div className="border-t border-zinc-700 pt-4 mt-4">
      <h3 className="text-sm font-semibold mb-3">Historial de pagos</h3>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Pagado: {fmt(item.totalPaid, item.currency)}</span>
          <span>Resta: {fmt(Math.max(remaining, 0), item.currency)}</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${progress >= 100 ? "bg-emerald-500" : "bg-primary"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">{progress.toFixed(0)}% del total ({fmt(totalAmount, item.currency)})</p>
      </div>

      {/* Payment list */}
      {item.payments.length > 0 ? (
        <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
          {item.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-xs bg-zinc-800/50 rounded-lg px-3 py-2">
              <span className="text-muted-foreground">{fmtDate(p.payment_date)}</span>
              <span className="font-medium">{fmt(Number(p.amount), p.currency)}</span>
              <span className="text-muted-foreground capitalize">{p.payment_method || "—"}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mb-3">Sin pagos registrados</p>
      )}

      {/* Add payment form */}
      {showForm ? (
        <div className="space-y-2 bg-zinc-800/30 rounded-lg p-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <input className={inputCls} type="number" placeholder="Monto" value={payAmount} onChange={e=>setPayAmount(e.target.value)} />
            </div>
            <div className="flex-1">
              <input className={inputCls} type="date" value={payDate} onChange={e=>setPayDate(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <select className={inputCls} value={payMethod} onChange={e=>setPayMethod(e.target.value)}>
              {PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <input className={inputCls} placeholder="Notas (opcional)" value={payNotes} onChange={e=>setPayNotes(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setShowForm(false)} className="flex-1 py-1.5 rounded-lg bg-zinc-700 text-xs hover:bg-zinc-600 transition-colors">Cancelar</button>
            <button onClick={handleAdd} disabled={saving || !payAmount}
              className="flex-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? "Guardando..." : "Registrar pago"}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setShowForm(true)}
          className="w-full py-1.5 rounded-lg border border-dashed border-zinc-600 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1">
          <Plus className="h-3 w-3" /> Agregar pago
        </button>
      )}
    </div>
  );
}

/* ─── Add/Edit Modal ─── */
function ItemModal({
  open,onOpenChange,categories,onSave,onUpload,editItem,onAddCategory,onAddPayment,
}:{
  open:boolean;
  onOpenChange:(o:boolean)=>void;
  categories:Category[];
  onSave:(type:ItemType,data:Record<string,unknown>,editId?:string)=>Promise<void>;
  onUpload:(f:File)=>Promise<string|null>;
  editItem:UnifiedItem|null;
  onAddCategory:(name:string,color:string)=>Promise<void>;
  onAddPayment:(itemId:string,itemType:ItemType,amount:number,currency:"ARS"|"USD",paymentDate:string,paymentMethod:string,notes?:string)=>Promise<void>;
}){
  const isEdit=!!editItem;
  const [type,setType]=useState<ItemType>(editItem?.type||"expense");
  const [desc,setDesc]=useState(editItem?.description||"");
  const [amount,setAmount]=useState(editItem?String(editItem.amount):"");
  const [currency,setCurrency]=useState<"ARS"|"USD">(editItem?.currency||"ARS");
  const [paidDate,setPaidDate]=useState(editItem?.paidDate||"");
  const [dueDate,setDueDate]=useState(editItem?.dueDate||"");
  const [category,setCategory]=useState(editItem?.category||"otros");
  const [paymentMethod,setPaymentMethod]=useState(editItem?.paymentMethod||"transferencia");
  const [recurrent,setRecurrent]=useState(editItem?.recurrent||false);
  const [entity,setEntity]=useState(editItem?.entity||"personal");
  const [receiptUrl,setReceiptUrl]=useState(editItem?.receiptUrl||"");
  const [paymentType,setPaymentType]=useState<"total"|"partial">("total");
  const [amountPaid,setAmountPaid]=useState("");
  const [uploading,setUploading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [catModalOpen,setCatModalOpen]=useState(false);

  const reset=useCallback(()=>{
    if(editItem){
      setType(editItem.type);
      setDesc(editItem.description);
      setAmount(String(editItem.type === "debt" ? (editItem.rawItem as { total_amount: number }).total_amount : editItem.amount));
      setCurrency(editItem.currency);
      setPaidDate(editItem.paidDate||"");
      setDueDate(editItem.dueDate||"");
      setCategory(editItem.category||"otros");
      setPaymentMethod(editItem.paymentMethod||"transferencia");
      setRecurrent(editItem.recurrent||false);
      setEntity(editItem.entity||"personal");
      setPaymentType("total");setAmountPaid("");
      setReceiptUrl(editItem.receiptUrl||"");
    } else {
      setType("expense");setDesc("");setAmount("");setCurrency("ARS");
      setPaidDate("");setDueDate("");setCategory("otros");
      setPaymentMethod("transferencia");setRecurrent(false);setReceiptUrl("");
      setPaymentType("total");setAmountPaid("");setEntity("personal");
    }
  },[editItem]);

  const handleOpenChange=(o:boolean)=>{
    if(o) reset();
    onOpenChange(o);
  };

  const handleFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];
    if(!f)return;
    setUploading(true);
    const url=await onUpload(f);
    if(url) setReceiptUrl(url);
    setUploading(false);
  };

  const handleSave=async()=>{
    setSaving(true);
    const data:Record<string,unknown>={};
    if(type==="expense"){
      data.name=desc;data.amount=Number(amount);data.currency=currency;
      data.category=category;data.payment_method=paymentMethod;
      data.recurrent=recurrent;data.active=true;data.entity=entity;
      data.paid=paymentType==="total"&&!!paidDate;
      data.due_date=dueDate||null;data.receipt_url=receiptUrl||null;
      data.paid_date=paidDate||null;
      if(!isEdit) data.user_id="d1b09b1a-919e-43fa-b70b-19b0be37cabe";
    } else if(type==="income"){
      data.source=desc;data.amount=Number(amount);data.currency=currency;
      data.category=category;data.payment_method=paymentMethod;
      data.expected_date=dueDate||null;data.receipt_url=receiptUrl||null;
      data.paid_date=paidDate||null;data.status=paidDate?"received":"expected";data.probability="high";data.entity=entity;
      data.paid=paymentType==="total"&&!!paidDate;
      if(!isEdit) data.user_id="d1b09b1a-919e-43fa-b70b-19b0be37cabe";
    } else {
      data.description=desc;data.total_amount=Number(amount);
      data.amount_paid=0;
      data.currency=currency;data.due_date=dueDate||null;
      data.payment_method=paymentMethod;data.receipt_url=receiptUrl||null;
      data.status=paymentType==="total"&&paidDate?"paid":"pending";data.priority="medium";data.entity=entity;
      if(!isEdit) data.user_id="d1b09b1a-919e-43fa-b70b-19b0be37cabe";
    }
    // Pass partial amount info for create
    if(!isEdit && paymentType==="partial" && amountPaid && Number(amountPaid)>0){
      data._partialAmount = Number(amountPaid);
    }

    await onSave(type,data,editItem?.id);
    setSaving(false);
    onOpenChange(false);
  };

  const handleAddPaymentFromHistory = async (payAmt:number, payDateStr:string, payMethodStr:string, notes?:string) => {
    if(!editItem) return;
    await onAddPayment(editItem.id, editItem.type, payAmt, editItem.currency, payDateStr, payMethodStr, notes);
  };

  const inputCls="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";
  const labelCls="text-xs text-muted-foreground mb-1 block";

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold">{isEdit?"Editar":"Agregar"} movimiento</Dialog.Title>
            <Dialog.Close className="p-1 hover:bg-zinc-800 rounded-lg"><X className="h-4 w-4"/></Dialog.Close>
          </div>

          {/* Type tabs */}
          <div className="flex gap-2 mb-4">
            {(["expense","income","debt"] as ItemType[]).map(t=>(
              <button key={t} onClick={()=>setType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${type===t?`${TYPE_COLORS[t].bg} ${TYPE_COLORS[t].text}`:"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div><label className={labelCls}>Descripción</label>
              <input className={inputCls} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Ej: Alquiler departamento"/></div>

            <div className="flex gap-3">
              <div className="flex-1"><label className={labelCls}>Monto</label>
                <input className={inputCls} type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0"/></div>
              <div className="w-24"><label className={labelCls}>Moneda</label>
                <button onClick={()=>setCurrency(c=>c==="ARS"?"USD":"ARS")}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-700 transition-colors">
                  {currency}
                </button>
              </div>
            </div>

            {!isEdit && (
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className={labelCls}>Tipo de pago</label>
                  <div className="flex gap-2">
                    <button onClick={()=>setPaymentType("total")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${paymentType==="total"?"bg-primary/20 text-primary":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                      Total
                    </button>
                    <button onClick={()=>setPaymentType("partial")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${paymentType==="partial"?"bg-amber-500/20 text-amber-400":"bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                      Parcial
                    </button>
                  </div>
                </div>
                {paymentType==="partial"&&(
                  <div className="flex-1">
                    <label className={labelCls}>Monto pagado</label>
                    <input className={inputCls} type="number" value={amountPaid} onChange={e=>setAmountPaid(e.target.value)} placeholder="0"/>
                    {amount&&amountPaid&&Number(amountPaid)<Number(amount)&&(
                      <p className="text-xs text-amber-400 mt-1">Resta: {currency==="USD"?"US$ ":"$ "}{(Number(amount)-Number(amountPaid)).toLocaleString("es-AR")}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex-1"><label className={labelCls}>Fecha de pago</label>
                <input className={inputCls} type="date" value={paidDate} onChange={e=>setPaidDate(e.target.value)}/></div>
              <div className="flex-1"><label className={labelCls}>Fecha vencimiento</label>
                <input className={inputCls} type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/></div>
            </div>

            <div><label className={labelCls}>Categoría <button onClick={()=>setCatModalOpen(true)} className="ml-1 hover:text-primary"><Settings className="h-3 w-3 inline"/></button></label>
              <select className={inputCls} value={category} onChange={e=>setCategory(e.target.value)}>
                {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div><label className={labelCls}>Forma de pago</label>
              <select className={inputCls} value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div><label className={labelCls}>Pertenece a</label>
              <select className={inputCls} value={entity} onChange={e=>setEntity(e.target.value)}>
                {ENTITIES.map(e=><option key={e} value={e}>{e.charAt(0).toUpperCase()+e.slice(1)}</option>)}
              </select>
            </div>

            {type==="expense"&&(
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={recurrent} onChange={e=>setRecurrent(e.target.checked)}
                  className="rounded border-zinc-600 bg-zinc-800"/>
                Recurrente
              </label>
            )}

            <div><label className={labelCls}>Comprobante</label>
              {receiptUrl?
                <div className="flex items-center gap-2 text-sm">
                  <Paperclip className="h-4 w-4 text-primary"/>
                  <a href={receiptUrl} target="_blank" rel="noopener" className="text-primary hover:underline truncate">Comprobante adjunto</a>
                  <button onClick={()=>setReceiptUrl("")} className="text-zinc-500 hover:text-rose-400"><X className="h-3 w-3"/></button>
                </div>
              :
                <input type="file" accept="image/*,.pdf" onChange={handleFile} disabled={uploading}
                  className="text-sm text-zinc-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-zinc-300 file:cursor-pointer"/>
              }
              {uploading&&<p className="text-xs text-muted-foreground mt-1">Subiendo...</p>}
            </div>
          </div>

          {/* Payment History (only in edit mode) */}
          {isEdit && editItem && (
            <PaymentHistory item={editItem} onAddPayment={handleAddPaymentFromHistory} />
          )}

          <div className="flex gap-3 mt-6">
            <Dialog.Close className="flex-1 py-2 rounded-lg bg-zinc-800 text-sm hover:bg-zinc-700 transition-colors">Cancelar</Dialog.Close>
            <button onClick={handleSave} disabled={saving||!desc||!amount}
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving?"Guardando...":isEdit?"Guardar":"Agregar"}
            </button>
          </div>

          {/* Category sub-modal */}
          <CategoryModal open={catModalOpen} onOpenChange={setCatModalOpen} categories={categories} onAdd={onAddCategory}/>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ─── Category Manager Modal ─── */
function CategoryModal({open,onOpenChange,categories,onAdd}:{
  open:boolean;onOpenChange:(o:boolean)=>void;categories:Category[];
  onAdd:(name:string,color:string)=>Promise<void>;
}){
  const [name,setName]=useState("");
  const [color,setColor]=useState(PRESET_COLORS[0]);

  if(!open)return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={()=>onOpenChange(false)}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 w-full max-w-sm" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Gestionar categorías</h3>
          <button onClick={()=>onOpenChange(false)}><X className="h-4 w-4"/></button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
          {categories.map(c=>(
            <div key={c.id} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor:c.color}}/>
              <span className="flex-1">{c.name}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-700 pt-3">
          <p className="text-xs text-muted-foreground mb-2">Nueva categoría</p>
          <div className="flex gap-2 mb-2">
            <input className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary"
              value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre"/>
          </div>
          <div className="flex gap-1.5 mb-3">
            {PRESET_COLORS.map(c=>(
              <button key={c} onClick={()=>setColor(c)}
                className={`w-6 h-6 rounded-full transition-all ${color===c?"ring-2 ring-primary ring-offset-1 ring-offset-zinc-900":""}`}
                style={{backgroundColor:c}}/>
            ))}
          </div>
          <button onClick={async()=>{if(name){await onAdd(name,color);setName("");}}}
            className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            disabled={!name}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter Bar ─── */
function FilterBar({
  statusFilter,setStatusFilter,typeFilter,setTypeFilter,
  categoryFilter,setCategoryFilter,paymentFilter,setPaymentFilter,
  sortField,setSortField,categories,
}:{
  statusFilter:StatusFilter;setStatusFilter:(v:StatusFilter)=>void;
  typeFilter:ItemType|"all";setTypeFilter:(v:ItemType|"all")=>void;
  categoryFilter:string;setCategoryFilter:(v:string)=>void;
  paymentFilter:string;setPaymentFilter:(v:string)=>void;
  sortField:SortField;setSortField:(v:SortField)=>void;
  categories:Category[];
}){
  const selectCls="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-primary";
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b border-border">
      <Filter className="h-4 w-4 text-muted-foreground"/>
      <select className={selectCls} value={statusFilter} onChange={e=>setStatusFilter(e.target.value as StatusFilter)}>
        <option value="all">Estado: Todos</option>
        <option value="paid">✅ Pagados</option>
        <option value="overdue">🔴 Vencidos</option>
        <option value="upcoming">⏳ Próximos</option>
        <option value="ontime">🟡 A tiempo</option>
      </select>
      <select className={selectCls} value={typeFilter} onChange={e=>setTypeFilter(e.target.value as ItemType|"all")}>
        <option value="all">Tipo: Todos</option>
        <option value="expense">Gastos</option>
        <option value="income">Ingresos</option>
        <option value="debt">Deudas</option>
      </select>
      <select className={selectCls} value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
        <option value="all">Categoría: Todas</option>
        {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
      </select>
      <select className={selectCls} value={paymentFilter} onChange={e=>setPaymentFilter(e.target.value)}>
        <option value="all">Pago: Todos</option>
        {PAYMENT_METHODS.map(m=><option key={m} value={m}>{m}</option>)}
      </select>
      <div className="ml-auto">
        <select className={selectCls} value={sortField} onChange={e=>setSortField(e.target.value as SortField)}>
          <option value="due_date">Ordenar: Vencimiento</option>
          <option value="amount">Ordenar: Monto</option>
          <option value="paid_date">Ordenar: Fecha pago</option>
        </select>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function FinancesPage() {
  const fin = useFinances();
  const {
    loading, selectedMonth, setSelectedMonth,
    totalExpensesARS, totalDebtsARS, totalIncomeARS,
    gap, semaphore, filteredItems,
    blueRate, updateBlueRate, categories,
    statusFilter, setStatusFilter, typeFilter, setTypeFilter,
    categoryFilter, setCategoryFilter, paymentFilter, setPaymentFilter,
    sortField, setSortField, togglePaid, insertItem, updateItem,
    addCategory, uploadReceipt, addPayment,
  } = fin;

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<UnifiedItem | null>(null);

  const prevMonth = () => setSelectedMonth(p => {
    const m = p.month - 1;
    return m < 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: m };
  });
  const nextMonth = () => setSelectedMonth(p => {
    const m = p.month + 1;
    return m > 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: m };
  });

  const handleSave = async (type: ItemType, data: Record<string, unknown>, editId?: string) => {
    if (editId) {
      await updateItem(type, editId, data);
    } else {
      const inserted = await insertItem(type, data);
      // If partial payment on create, register the initial payment
      if (inserted && data._partialAmount) {
        await addPayment(
          inserted.id,
          type,
          Number(data._partialAmount),
          (data.currency as "ARS" | "USD") || "ARS",
          new Date().toISOString().split("T")[0],
          (data.payment_method as string) || "transferencia"
        );
      }
    }
  };

  const handleAddPayment = async (itemId: string, itemType: ItemType, amount: number, currency: "ARS"|"USD", paymentDate: string, paymentMethod: string, notes?: string) => {
    await addPayment(itemId, itemType, amount, currency, paymentDate, paymentMethod, notes);
    // Refresh editItem with updated data after payment
    // The refetch in addPayment will update the data
  };

  const openEdit = (item: UnifiedItem) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const semaphoreIcon = semaphore === "green" ? "🟢" : semaphore === "yellow" ? "🟡" : "🔴";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="mx-[25px]">
      {/* Header */}
      <motion.div className="flex items-center justify-between mb-6" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Wallet className="h-7 w-7 text-primary"/>Finanzas
          </h1>
          <EditableDollar value={blueRate} onChange={updateBlueRate}/>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openNew}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4"/>Agregar
          </button>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-2 py-1">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><ChevronLeft className="h-4 w-4"/></button>
            <span className="text-sm font-medium min-w-[120px] text-center">{MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><ChevronRight className="h-4 w-4"/></button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><TrendingDown className="h-4 w-4 text-rose-400"/>Gastos mensuales</div>
          <p className="text-xl font-bold text-rose-400">{fmtARS(totalExpensesARS)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><AlertCircle className="h-4 w-4 text-amber-400"/>Deudas del mes</div>
          <p className="text-xl font-bold text-amber-400">{fmtARS(totalDebtsARS)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><TrendingUp className="h-4 w-4 text-emerald-400"/>Ingresos esperados</div>
          <p className="text-xl font-bold text-emerald-400">{fmtARS(totalIncomeARS)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><span className="text-base">{semaphoreIcon}</span>Balance</div>
          <p className={`text-xl font-bold ${gap>=0?"text-emerald-400":"text-rose-400"}`}>{fmtARS(gap)}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {/* Table */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div className="rounded-xl border border-border bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-primary"/>Movimientos</h2>
              <span className="text-xs text-muted-foreground">{filteredItems.length} items</span>
            </div>

            <FilterBar
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              typeFilter={typeFilter} setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              paymentFilter={paymentFilter} setPaymentFilter={setPaymentFilter}
              sortField={sortField} setSortField={setSortField}
              categories={categories}
            />

            {/* Table header — 10 cols + actions */}
            <div className="hidden md:grid grid-cols-[65px_1fr_90px_100px_90px_80px_80px_70px_60px_50px_36px] px-0 py-2 text-xs text-muted-foreground border-b-2 border-border/60 bg-zinc-800/30">
              <span className="px-3 border-r border-border/40">Fecha</span>
              <span className="px-3 border-r border-border/40">Descripción</span>
              <span className="px-3 border-r border-border/40">Monto</span>
              <span className="px-3 border-r border-border/40">Pago parcial</span>
              <span className="px-3 border-r border-border/40">Monto USD</span>
              <span className="px-3 border-r border-border/40">Categoría</span>
              <span className="px-3 border-r border-border/40">Pago</span>
              <span className="px-3 border-r border-border/40">Vence</span>
              <span className="px-3 border-r border-border/40">Estado</span>
              <span className="px-3 border-r border-border/40">Tipo</span>
              <span className="px-3"></span>
            </div>

            <div className="divide-y divide-border">
              {filteredItems.length===0?(
                <div className="p-8 text-center text-muted-foreground text-sm">Sin movimientos</div>
              ):(
                filteredItems.map(item=>{
                  const st=getItemStatus(item);
                  const stCfg=STATUS_CONFIG[st];
                  const tColors=TYPE_COLORS[item.type];
                  const catColor=CATEGORY_COLORS[item.category||"otros"]||(categories.find(c=>c.name===item.category)?.color)||"#94A3B8";
                  const totalAmount = item.type === "debt" ? (item.rawItem as { total_amount: number }).total_amount : item.amount;
                  const hasPartialPayments = item.payments.length > 0 && item.totalPaid > 0 && item.totalPaid < totalAmount;

                  // USD conversion: show in USD if original is ARS, show in ARS if original is USD
                  const usdAmount = item.currency === "USD" ? item.amount : item.amount / blueRate;

                  return (
                    <div key={`${item.type}-${item.id}`}
                      className={`grid grid-cols-1 md:grid-cols-[65px_1fr_90px_100px_90px_80px_80px_70px_60px_50px_36px] items-center px-0 py-2.5 hover:bg-zinc-800/50 transition-colors ${item.paid?"opacity-60":""}`}>

                      {/* 1. Fecha */}
                      <span className="text-xs font-mono text-muted-foreground px-3 border-r border-border/30">{fmtDate(item.paidDate||item.dueDate||item.fullDate)}</span>

                      {/* 2. Descripción */}
                      <div className="min-w-0 px-3 border-r border-border/30">
                        <p className={`text-sm font-medium truncate ${item.paid?"line-through":""}`}>{item.description}</p>
                        {item.entity && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${(ENTITY_COLORS[item.entity]||ENTITY_COLORS.personal).bg} ${(ENTITY_COLORS[item.entity]||ENTITY_COLORS.personal).text} md:hidden`}>
                            {item.entity}
                          </span>
                        )}
                      </div>

                      {/* 3. Monto (total original) */}
                      <span className={`text-sm font-semibold ${tColors.text} px-3 border-r border-border/30`}>
                        {item.type==="income"?"+":"-"}{fmt(totalAmount,item.currency)}
                      </span>

                      {/* 4. Pago parcial */}
                      <span className="text-xs px-3 border-r border-border/30">
                        {hasPartialPayments ? (
                          <span className="text-amber-400">{fmtShort(item.totalPaid, item.currency)} de {fmtShort(totalAmount, item.currency)}</span>
                        ) : item.payments.length > 0 && item.totalPaid >= totalAmount ? (
                          <span className="text-emerald-400">Completo</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </span>

                      {/* 5. Monto en USD */}
                      <span className="text-xs text-muted-foreground px-3 border-r border-border/30">
                        {item.currency === "USD" ? fmt(item.amount, "USD") : `US$ ${Math.round(usdAmount).toLocaleString("es-AR")}`}
                      </span>

                      {/* 6. Categoría */}
                      <div className="flex items-center gap-1.5 px-3 border-r border-border/30">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:catColor}}/>
                        <span className="text-xs truncate">{item.category||"—"}</span>
                      </div>

                      {/* 7. Pago (método) */}
                      <span className="text-xs text-muted-foreground capitalize px-3 border-r border-border/30">{item.paymentMethod||"—"}</span>

                      {/* 8. Vencimiento */}
                      <span className="text-xs text-muted-foreground px-3 border-r border-border/30">{fmtDate(item.dueDate)}</span>

                      {/* 9. Estado */}
                      <div className="px-3 border-r border-border/30 flex items-center">
                        <button
                          onClick={()=>{
                            // Only allow toggle if fully paid or no partial payments
                            if(item.payments.length > 0 && item.totalPaid < totalAmount && !item.paid) return;
                            togglePaid(item);
                          }}
                          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${stCfg.cls} ${item.payments.length > 0 && item.totalPaid < totalAmount && !item.paid ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                          title={stCfg.label}
                        >
                          {stCfg.emoji}
                        </button>
                      </div>

                      {/* 10. Tipo + Entity */}
                      <div className="hidden md:flex flex-col gap-0.5 items-start px-3 border-r border-border/30">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tColors.bg} ${tColors.text}`}>
                          {TYPE_SHORT[item.type]}
                        </span>
                        {item.entity && item.entity !== "personal" && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${(ENTITY_COLORS[item.entity]||ENTITY_COLORS.personal).bg} ${(ENTITY_COLORS[item.entity]||ENTITY_COLORS.personal).text}`}>
                            {item.entity}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 px-3">
                        {item.receiptUrl&&<a href={item.receiptUrl} target="_blank" rel="noopener"><Paperclip className="h-3.5 w-3.5 text-primary"/></a>}
                        <button onClick={()=>openEdit(item)} className="hover:text-primary"><Pencil className="h-3.5 w-3.5"/></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Modal */}
      <ItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        categories={categories}
        onSave={handleSave}
        onUpload={uploadReceipt}
        editItem={editItem}
        onAddCategory={addCategory}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
}
