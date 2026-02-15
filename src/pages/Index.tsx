import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Heart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Charitable Planning",
    description: "Combine philanthropy with tax savings through trusts, foundations, and giving strategies.",
    icon: Heart,
    color: "bg-charitable text-charitable-foreground",
  },
  {
    title: "Personal Planning",
    description: "Protect assets and transfer wealth through family trusts, partnerships, and estate structures.",
    icon: Shield,
    color: "bg-personal text-personal-foreground",
  },
  {
    title: "Qualified Plans",
    description: "Maximize retirement savings and minimize taxes with employer and individual retirement accounts.",
    icon: TrendingUp,
    color: "bg-qualified text-qualified-foreground",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-charitable/80 opacity-90" />
        <div className="relative container py-24 md:py-36 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-serif mb-6 leading-tight"
          >
            Build Your
            <br />
            <span className="text-gold">Estate Planning Blueprint™</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-primary-foreground/85"
          >
            Discover the building blocks of a comprehensive estate plan. Explore
            strategies, take a personalized assessment, and find the right tools
            to protect your family's future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/blueprint">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold px-8">
                Explore the Blueprint
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/assessment">
              <Button
                size="lg"
                variant="outline"
                className="border-gold bg-gold/10 text-gold hover:bg-gold/20 font-semibold"
              >
                Start Your Assessment
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-center mb-4">
          Three Pillars of Estate Planning
        </h2>
        <p className="text-center text-muted-foreground max-w-xl mx-auto mb-12">
          Our planning framework covers three essential categories to build a
          comprehensive strategy tailored to your needs.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${cat.color} mb-5`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-3">
                      {cat.title}
                    </h3>
                    <p className="text-muted-foreground">{cat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted py-20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold font-serif mb-4">
            Ready to Plan Your Future?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Take our personalized assessment to discover which estate planning
            strategies are right for your situation and goals.
          </p>
          <Link to="/assessment">
            <Button size="lg" className="font-semibold px-8">
              Start Your Free Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
