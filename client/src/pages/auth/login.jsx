import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth_slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // spinner icon

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please complete all fields");
      return;
    }

    setLoading(true);
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message || "Logged-in successfully");
      } else {
        toast.error(data?.payload?.message || "Incorrect id/password");
        setLoading(false);
      }
    });
  }

  return (
    <div className="mx-auto font-[Rajdhani] w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2 text-gray-700">
          Don't have an account?
          <Link
            to="/auth/register"
            className=" ml-2 font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={
          loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </span>
          ) : (
            "Sign In"
          )
        }
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        disabled={loading}
      />
    </div>
  );
}

export default AuthLogin;
