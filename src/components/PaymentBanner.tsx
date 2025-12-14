import { CreditCard, Sparkles, Check } from "lucide-react";
import { Button } from "./ui/button";

export const PaymentBanner = () => {
    return (
        <div className="transition-all duration-500 bg-black/0 border-b border-border">
            <div className="container mx-auto max-w-7xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-semibold text-foreground">
                                Premium Cards from ₹2.99
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Instant download • HD Quality
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                <span>Secure</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                <span>Instant</span>
                            </div>
                        </div>
                        <Button asChild size="sm" className="gap-2 text-xs sm:text-sm shadow-lg">
                            <a href="#classic-templates">
                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                                View Cards
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};