const LoopDiagram = () => {
  const steps = [
    { label: "Waste", emoji: "🗑", desc: "Collected organic waste", value: "2,340 kg" },
    { label: "Compost", emoji: "🌱", desc: "Decomposed into nutrients", value: "1,870 kg" },
    { label: "Crop", emoji: "🌾", desc: "Grown from compost", value: "890 kg" },
    { label: "Sale", emoji: "💰", desc: "Sold at local markets", value: "$4,200" },
    { label: "Reinvest", emoji: "🔄", desc: "Back into the cell", value: "$2,100" },
  ];

  return (
    <div className="bg-card border border-border rounded-md p-6">
      <h3 className="font-mono text-sm font-semibold text-foreground mb-6">
        // regenerative_loop
      </h3>
      <div className="flex flex-col gap-1">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-lg shrink-0">
                {step.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-medium text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
              <p className="font-mono text-sm font-semibold text-moss shrink-0">{step.value}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-8 h-4 border-l-2 border-dashed border-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoopDiagram;
