import { Shield, Zap, Download, CreditCard } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Secure Payments",
        description: "256-bit SSL encryption protects your transactions",
    },
    {
        icon: Zap,
        title: "Instant Access",
        description: "Download your cards immediately after purchase",
    },
    {
        icon: Download,
        title: "HD Quality",
        description: "High-resolution files ready for printing",
    },
    {
        icon: CreditCard,
        title: "Flexible Options",
        description: "Pay per download or subscribe for unlimited access",
    },
];

export const PaymentFeatures = () => {
    return (
        <section className="py-16 bg-muted/30">
            < div className="container mx-auto max-w-7xl px-4">
                < div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        Why Choose Our Service ?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Professional business cards with secure and hassle - free payment processing
                    </p >
                </div >

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {
                        features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 animate-scale-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                                    < feature.icon className="w-6 h-6 text-primary" />
                                </div >
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3 >
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p >
                            </div >
                        ))}
                </div >
            </div >
        </section >
    );
};
