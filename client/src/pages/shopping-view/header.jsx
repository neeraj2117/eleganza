import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { shoppingViewHeaderMenuItems } from "@/config";
import { logoutUser } from "@/store/auth_slice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { House, LogOut, Menu, ShoppingCart, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "@/components/ui/label";
import { useSearchParam } from "react-use";
import { FaShoppingCart } from "react-icons/fa";
import logo1 from "../../assets/el-logo.png";
import logo2 from "../../assets/el-logo2.png";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            Category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mt-0 ml-2 lg:mb-0 lg:items-center gap-15 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="font-rajdhani text-lg cursor-pointer font-medium"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.shopCart);

  function handleLogout() {
    toast.success("Logged-out successfully!");
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          variant="outline"
          className="relative p-3 h-9 w-9 flex items-center justify-center cursor-pointer"
          onClick={() => setOpenCartSheet(true)}
        >
          <FaShoppingCart size={40} />

          {/* Cart Count Badge */}
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
              {cartItems.items.length}
            </span>
          )}

          <span className="sr-only">User cart</span>
        </Button>

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : null
          }
        />
      </Sheet>

      {/* Removed hover logic */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black rounded-full cursor-pointer">
            <AvatarFallback className="bg-black text-lg rounded-full text-white font-extrabold">
              {user?.userName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="bottom"
          className="w-56 mt-0 mr-6 border border-gray-200"
        >
          <DropdownMenuLabel>Logged in as: {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer"
          >
            <User className="mr-2 h-6 w-6" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false); // ✅ added this
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 mb-20 right-0 z-50 w-full border-b border-gray-200 bg-background transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex h-18 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <img src={logo1} className="h-15 mt-1 w-53 ml-4" />
        </Link>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <div className="flex items-center justify-between mb-6 px-3 py-3 mt-8 border rounded-md border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar className="bg-black rounded-full">
                  <AvatarFallback className="bg-black px-3 py-2 text-lg rounded-full text-white font-extrabold">
                    {user?.userName?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-xl">{user?.userName}</span>
              </div>

              <Button onClick={() => {
                  setOpenMobileMenu(false);
                  navigate("/shop/checkout");
                }} variant="outline" size="icon">
                <ShoppingCart className="h-6 w-6" />
              </Button>
            </div>

            <MenuItems />
          </SheetContent>
        </Sheet>

        {/* Desktop */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
