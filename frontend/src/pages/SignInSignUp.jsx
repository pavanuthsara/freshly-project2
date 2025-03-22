import { useState } from "react";

const SignInSignUp = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`relative w-[768px] max-w-full min-h-[480px] rounded-lg shadow-lg bg-white overflow-hidden transition-all duration-600 ${isRightPanelActive ? "right-panel-active" : ""}`}
      >
        {/* Sign Up Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-600 ${isRightPanelActive ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <form className="flex flex-col items-center text-center p-6">
            <h1 className="text-xl font-bold">Create Account</h1>
            <span className="text-sm">or use your email for registration</span>
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="text" placeholder="Name" />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="email" placeholder="Email" />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="password" placeholder="Password" />
            <button className="mt-4 px-6 py-2 text-white bg-red-500 rounded-full">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-600 ${isRightPanelActive ? "opacity-0 z-0" : "opacity-100 z-10"}`}>
          <form className="flex flex-col items-center text-center p-6">
            <h1 className="text-xl font-bold">Sign in</h1>
        
            <span className="text-sm">or use your account</span>
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="email" placeholder="Email" />
            <input className="w-full p-2 mt-2 bg-gray-200 rounded" type="password" placeholder="Password" />
            <a href="#" className="text-sm mt-2">Forgot your password?</a>
            <button className="mt-4 px-6 py-2 text-white bg-red-500 rounded-full">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center text-white p-8 transition-transform duration-600" style={{ transform: isRightPanelActive ? "translateX(-100%)" : "translateX(0)" }}>
          <div className="text-center">
            {isRightPanelActive ? (
              <>
                <h1 className="text-2xl font-bold">Welcome Back!</h1>
                <p className="mt-2">To keep connected with us please login with your personal info</p>
                <button onClick={() => setIsRightPanelActive(false)} className="mt-4 px-6 py-2 border-white border rounded-full">Sign In</button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">Hello, Friend!</h1>
                <p className="mt-2">Enter your personal details and start the journey with us</p>
                <button onClick={() => setIsRightPanelActive(true)} className="mt-4 px-6 py-2 border-white border rounded-full">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default SignInSignUp;
