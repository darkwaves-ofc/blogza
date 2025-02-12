import React from 'react';
// import { fjallaone_n42 } from "@/app/layout";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Currency from "./Currency";
import { getMyPreferencesInfo } from "@/actions/user/info";
// import { getAllCurrenciesInfo } from "@/actions/currency/info";
import { Twitter, Instagram, Facebook, Youtube, Send, CreditCard, ShoppingCartIcon as Paypal, Bitcoin } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Footer() {
  const userPreferences = await getMyPreferencesInfo({});
  // const currenciesInfo = await getAllCurrenciesInfo();

  return (
    <footer className={cn("bg-gradient-to-br from-gray-900 to-black text-white py-16")}>
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Sign up and save
            </h3>
            <p className="text-sm text-gray-400">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form action={`/auth/register`} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                name="emailSubscribe"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:ring-2"
              />
              <Button
                type="submit"
                variant="outline"
                className="bg-gradient-to-r text-white border-none"
              >
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
            <div className="flex space-x-4">
              <Link href="https://twitter.com/Zyvlon" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-white hover:text-purple-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Menu
            </h4>
            <ul className="space-y-3 text-sm">
              {['Search', 'Home', 'Dakimakura', 'Posters', 'Affiliates'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Search' ? '/products' : item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-white transition-colors hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {['About', 'Support', 'Refund Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Country Selector */}
          {/* {userPreferences.preferences && !("error" in currenciesInfo) && (
            <div>
              <h4 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
                Select Currency
              </h4>
              <ScrollArea className="h-[200px] w-[200px] rounded-md border border-white/20 p-4">
                <Currency
                  currenciesInfo={currenciesInfo}
                  preferences={userPreferences.preferences}
                />
              </ScrollArea>
            </div>
          )} */}
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Payment Methods */}
        <div className="mt-8">
          <h4 className="text-center text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
            Accepted Payment Methods
          </h4>
          <div className="flex flex-wrap justify-center gap-6">
            <CreditCard className="w-12 h-8 text-gray-400" />
            <Paypal className="w-12 h-8 text-gray-400" />
            <Bitcoin className="w-12 h-8 text-gray-400" />
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Powered by{' '}
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300">
              Zyvlon
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

