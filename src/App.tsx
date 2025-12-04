import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AIChatbot from "@/components/AIChatbot";
// import TemplateRenderer from "./components/TemplateRenderer";
// import { photoFrameTemplate } from "./components/templates/photoFrameTemplate";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
              <AIChatbot />

        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./router";
// import { AuthProvider } from "./contexts/AuthContext";
// import { CartProvider } from "./contexts/CartContext";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <AuthProvider>
//         <CartProvider>
//           <RouterProvider router={router} />
//           {/* AIChatbot को यहाँ से हटा दें - यह router में होगा */}
//         </CartProvider>
//       </AuthProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;