import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  UserStar,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icons: <LayoutDashboard strokeWidth={2.1} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icons: <ShoppingBasket strokeWidth={2.1} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icons: <BadgeCheck strokeWidth={2.1} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-6 lg:ml-5 font-[Rajdhani] flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItems) => (
        <div
          key={menuItems.id}
          onClick={() => {
            navigate(menuItems.path);
            if (setOpen) setOpen(false);
          }}
          className="flex items-center gap-3 rounded-md px-2 py-2
                     text-black hover:bg-black hover:text-white cursor-pointer 
                     transition-colors duration-200 mx-1"
        >
          {/* Icon inherits text color now */}
          <div className="w-6 h-6">{menuItems.icons}</div>
          <span style={{ fontSize: "22px", fontWeight: 400 }}>
            {menuItems.label}
          </span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 font-[Rajdhani]">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-gray-200">
              <SheetTitle className="flex gap-3 mt-5 mb-5">
                <ChartNoAxesCombined size={30} className="mt-1" />
                <h1 className="text-[27px] font-semibold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-70 flex-col border-r border-gray-200 bg-background lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 px-11 py-6"
        >
          <ChartNoAxesCombined size={31} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
