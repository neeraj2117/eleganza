import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth_slice";
import { toast } from "sonner";

function AdminHeader({setOpen}) {
  const dispatch = useDispatch();
  
  function handleLogout() {
    dispatch(logoutUser()).then(() => {
      toast.success('Logged-out Successfully ')
    })
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b-1 border-gray-200">
      <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block">
        <Menu />
        <span className="sr-only">Toggle Menu </span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button onClick={handleLogout} className="inline-flex gap-2 cursor-pointer items-center rounded-sm px-6 py-5 text-[17px] font-medium shadow">
          <LogOut size={45} strokeWidth={2.5} />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
