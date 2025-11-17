import "../../style/ErrorBlock.css";

export default function ErrorBlock({ children }) {
  return (
    <div className="error-block" role="alert">
      {children}
    </div>
  );
}
