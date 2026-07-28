type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const variants = {
    primary: "bg-green-500 hover:bg-green-600 text-white",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      className={`rounded-xl font-semibold transition-colors duration-200 ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}