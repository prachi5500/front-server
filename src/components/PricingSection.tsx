import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const pricingPlans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out our service",
        features: [
            "5 card downloads per month",
            "Access to basic templates",
            "Standard customization",
            "Watermarked downloads",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: "$9.99",
        period: "per month",
        description: "Best for professionals",
        features: [
            "Unlimited downloads",
            "All AI & Classic templates",
            "Advanced customization",
            "No watermarks",
            "Priority support",
            "HD quality exports",
        ],
        cta: "Upgrade to Pro",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "$49.99",
        period: "per month",
        description: "For teams and agencies",
        features: [
            "Everything in Pro",
            "Team collaboration",
            "Custom branding",
            "API access",
            "Dedicated support",
            "Bulk exports",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

export const PricingSection = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
            < div className="container mx-auto max-w-7xl px-4">
                < div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Choose Your Plan
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Create stunning business cards with our flexible pricing options
                    </p >
                </div >

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {
                        pricingPlans.map((plan, index) => (
                            <Card
                                key={plan.name}
                                className={`relative p-8 ${plan.popular
                                    ? "border-2 border-primary shadow-xl scale-105"
                                    : "border border-border"
                                    } animate - scale -in `}
                                style={{ animationDelay: `${index * 0.1} s` }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Most Popular
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="mb-2">
                                        <span className="text-5xl font-bold text-foreground">
                                            {plan.price}
                                        </span>
                                        <span className="text-muted-foreground ml-2">
                                            {plan.period}
                                        </span >
                                    </div >
                                    <p className="text-sm text-muted-foreground">
                                        {plan.description}
                                    </p >
                                </div >

                                <ul className="space-y-3 mb-8">
                                    {
                                        plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-2">
                                                < Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                < span className="text-sm text-foreground">{feature}</span>
                                            </li >
                                        ))
                                    }
                                </ul >

                                <Button
                                    className="w-full"
                                    variant={
                                        plan.popular ? "default" : "outline"}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </Card >
                        ))}
                </div >

                <div className="text-center mt-12 text-sm text-muted-foreground">
                    < p > All plans include secure payment processing and 30 - day money - back guarantee</p >
                </div >
            </div >
        </section >
    );
};
