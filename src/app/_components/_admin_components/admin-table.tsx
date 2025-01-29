import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TTable() {
  return (
    <div className="h-19 bg-background flex items-center justify-center border border-border text-sm">
      <div className="p-4 w-[4%]">
        <input type="checkbox" />
      </div>
      <div className="p-4 w-[4%]">1</div>
      <div className="p-4 w-[18%]">Amgalan</div>
      <div className="p-4 w-[13%]">2 foods</div>
      <div className="p-4 w-[14%]">2024/12/20</div>
      <div className="p-4 w-[13%]">45000</div>
      <div className="p-4 w-[18%] truncate">
        2024/12/СБД, 12-р хороо, СБД нэгдсэн эмнэлэг+ Sbd negdsen emneleg | 100
        айлын гүүрэн гарцны хойд талд 4д ногоонСБД, 12-р хороо, СБД нэгдсэн
        эмнэлэг Sbd negdsen emneleg | 100 айлын гүүрэн гарцны хойд талд 4д
        ногоон20
      </div>
      <div className="p-4 w-[13%]">
        <select className="text-background">
          <option>DELIVERED</option>
          <option>PENDING</option>
          <option>CANCELED</option>
        </select>
      </div>
    </div>
  );
}
