
export const SkeletonStatCard = () => (
  <div className="bg-white border-b-4 border-transparent p-10 space-y-6 shadow-xl relative overflow-hidden animate-pulse">
    <div className="flex justify-between items-start relative z-10">
      <div className="p-4 bg-slate/10 w-12 h-12 shadow-lg" />
      <div className="text-right space-y-1">
        <div className="h-2 w-12 bg-slate/5 rounded" />
        <div className="h-2 w-8 bg-slate/5 rounded ml-auto" />
      </div>
    </div>
    <div className="relative z-10 space-y-3">
      <div className="h-2 w-24 bg-slate/10 rounded" />
      <div className="h-10 w-32 bg-slate/5 rounded" />
    </div>
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="p-10">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 bg-slate/5 border border-primary/5" />
        <div className="h-3 w-20 bg-slate/10 rounded" />
      </div>
    </td>
    <td className="p-10">
      <div className="h-3 w-40 bg-slate/10 rounded" />
    </td>
    <td className="p-10">
      <div className="h-5 w-24 bg-slate/5 rounded" />
    </td>
    <td className="p-10">
      <div className="h-4 w-16 bg-slate/10 rounded" />
    </td>
    <td className="p-10">
      <div className="flex items-center gap-4">
        <div className="h-4 w-8 bg-slate/10 rounded" />
        <div className="w-20 h-1.5 bg-slate/5" />
      </div>
    </td>
    <td className="p-10">
      <div className="flex justify-center">
        <div className="w-20 h-6 bg-slate/5 rounded border border-slate/10" />
      </div>
    </td>
    <td className="p-10 text-right">
      <div className="w-10 h-10 bg-slate/5 border border-primary/5 ml-auto" />
    </td>
  </tr>
);










