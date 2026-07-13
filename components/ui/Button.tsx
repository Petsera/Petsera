type ButtonProps = {
  children: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition-colors">
      {children}
    </button>
  );
}