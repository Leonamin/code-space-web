
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "@/components/Header";
import Home from "@/pages/Home";
import CreateCodeSpace from "@/pages/CreateCodeSpace";
import CodeSpaceDetails from "@/pages/CodeSpaceDetails";
import CreateCodePiece from "@/pages/CreateCodePiece";
import EditCodePiece from "@/pages/EditCodePiece";
import CodePieceDetails from "@/pages/CodePieceDetails";
import ComparePieces from "@/pages/ComparePieces";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/spaces/create" element={<CreateCodeSpace />} />
              <Route path="/spaces/:spaceId" element={<CodeSpaceDetails />} />
              <Route path="/spaces/:spaceId/pieces/create" element={<CreateCodePiece />} />
              <Route path="/pieces/:pieceId" element={<CodePieceDetails />} />
              <Route path="/pieces/:pieceId/edit" element={<EditCodePiece />} />
              <Route path="/pieces/compare/:pieceIds" element={<ComparePieces />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
