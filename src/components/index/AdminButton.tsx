import { useNavigate } from "react-router-dom";

export const AdminButton = () => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate("/admin")}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
    >
      Admin Dashboard
    </button>
  );
};