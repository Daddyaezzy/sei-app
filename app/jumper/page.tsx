"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Menu,
  Settings,
  Wallet,
  Search,
  Sun,
  Moon,
  Bell,
  X,
  ArrowLeftRight,
  ArrowRightLeft,
  Fuel,
  ArrowRight,
  Route,
  Percent,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";

import JumperLayout from "../layouts/jumperLayout";

interface Token {
  name: string;
  address: string;
  symbol: string;
  image: string;
}

export default function Jumper() {
  const [mode, setMode] = useState<"exchange" | "gas">("exchange");
  const [view, setView] = useState<"main" | "from" | "to" | "settings">("main");
  const [showMenu, setShowMenu] = useState(false);
  const [showWalletField, setShowWalletField] = useState(false);
  const [selectedFromToken, setSelectedFromToken] = useState<Token | null>(
    null
  );
  const [selectedToToken, setSelectedToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [noneFound, setNoneFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getOtherTokens = async () => {
    setIsLoading(true);
    setError("");
    try {
      const apiKey = "EK-g5Pzu-jCzu51S-5sNww";
      const response = await axios.get(
        `https://api.ethplorer.io/getTopTokens?apiKey=${apiKey}`
      );

      const tokenData = response.data.tokens || [];
      const mappedTokens = tokenData.map((token: any) => ({
        name: token.name,
        address: token.address,
        symbol: token.symbol,
        image: `https://ethplorer.io${token.image}`,
      }));

      if (tokenData.length === 0) {
        setNoneFound(true);
      }

      setTokens(mappedTokens);
      setFilteredTokens(mappedTokens);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError("Failed to fetch tokens. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOtherTokens();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tokens.filter(
        (token) =>
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens(tokens);
    }
  }, [searchQuery, tokens]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById("menu");
      const menuButton = document.getElementById("menu-button");
      if (
        menu &&
        !menu.contains(e.target as Node) &&
        menuButton &&
        !menuButton.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const renderTokenList = () => {
    if (isLoading) {
      return (
        <div className="text-center text-gray-400 py-4">Loading tokens...</div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 py-4">
          {error}
          <button
            onClick={getOtherTokens}
            className="block mx-auto mt-2 text-[#8A2BE2] hover:underline"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (noneFound || filteredTokens.length === 0) {
      return (
        <div className="text-center text-gray-400 py-4">No tokens found</div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {filteredTokens.slice(0, 8).map((token, i) => (
            <div
              key={i}
              className="bg-[#24203D] p-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => {
                if (view === "from") setSelectedFromToken(token);
                else setSelectedToToken(token);
                setView("main");
              }}
            >
              <img
                src={token.image}
                alt={token.name}
                className="w-8 h-8 rounded-full"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredTokens.map((token, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 hover:bg-[#24203D] rounded-lg cursor-pointer"
              onClick={() => {
                if (view === "from") setSelectedFromToken(token);
                else setSelectedToToken(token);
                setView("main");
              }}
            >
              <img
                src={token.image}
                alt={token.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-white">{token.symbol}</div>
                <div className="text-gray-400 text-sm">{token.name}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <JumperLayout>
      <div className="min-h-screen">
        {/* Navbar */}

        {/* Menu Overlay */}

        {/* Main Content */}
        <div className="flex justify-center items-center p-4">
          <div className=" max-w-[500px] w-full flex items-start">
            {/* Mode Toggle */}

            <div className="md:flex hidden">
              <div className="bg-[#3F2D60] rounded-full p-1 mr-4 flex flex-col gap-2">
                <button
                  onClick={() => setMode("exchange")}
                  className={`px-3 py-3 rounded-full ${
                    mode === "exchange" ? "bg-[#665A81]" : ""
                  }`}
                >
                  <ArrowRightLeft className="text-white " />
                </button>
                <button
                  onClick={() => setMode("gas")}
                  className={`px-3 py-3  rounded-full ${
                    mode === "gas" ? "bg-[#665A81]" : ""
                  }`}
                >
                  <Fuel className="text-white " />
                </button>
              </div>
            </div>

            {/* Main Component */}
            <div className="bg-[#120F29] relative w-full rounded-lg p-6">
              {view === "main" ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-semibold text-xl">
                      {mode === "exchange" ? "Exchange" : "Gas"}
                    </h2>
                    <Settings
                      className="text-white cursor-pointer"
                      onClick={() => setView("settings")}
                    />
                  </div>

                  <div className="space-y-4">
                    {/* From Field */}
                    <div
                      className={`${
                        selectedFromToken !== null && selectedToToken !== null
                          ? "flex items-center gap-3 "
                          : "flex flex-col gap-4"
                      }`}
                    >
                      <div
                        className="bg-[#24203D] border border-[#302B52] relative w-full p-4 rounded-lg cursor-pointer"
                        onClick={() => setView("from")}
                      >
                        <div className="text-white text-sm">From</div>
                        <div className="flex items-center gap-2 mt-2">
                          {selectedFromToken ? (
                            <>
                              <img
                                src={selectedFromToken.image}
                                alt={selectedFromToken.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="text-white">
                                {selectedFromToken.symbol}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 relative bg-[#302B52] rounded-full">
                                <div className="w-5 h-5 border-2 border-[#282440] absolute bottom-0 right-[-4px] bg-[#302B52] rounded-full"></div>
                              </div>
                              <span className="text-gray-400">
                                Select chain and token
                              </span>
                            </>
                          )}
                        </div>
                        {selectedFromToken !== null &&
                          selectedToToken !== null &&
                          mode === "exchange" && (
                            <div className="p-2 flex items-center justify-center rounded-full right-[-25px] absolute bg-[#24203D] top-[35px] border border-[#302B52]">
                              <ArrowRight size={14} className="text-[11px]" />
                            </div>
                          )}
                      </div>

                      {/* To Field */}
                      <div
                        className="bg-[#24203D] border border-[#302B52] w-full p-4 rounded-lg cursor-pointer"
                        onClick={() => setView("to")}
                      >
                        <div className="text-white text-sm">To</div>
                        <div className="flex items-center gap-2 mt-2">
                          {selectedToToken ? (
                            <>
                              <img
                                src={selectedToToken.image}
                                alt={selectedToToken.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="text-white">
                                {selectedToToken.symbol}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 relative bg-[#302B52] rounded-full">
                                <div className="w-5 h-5 border-2 border-[#282440] absolute bottom-0 right-[-4px] bg-[#302B52] rounded-full"></div>
                              </div>
                              <span className="text-gray-400">
                                Select chain and token
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount Field */}
                    <div className="bg-[#24203D] p-4 rounded-lg">
                      <div className="text-white text-sm">Send</div>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedFromToken ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedFromToken.image}
                              alt={selectedFromToken.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="">
                              <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="bg-transparent text-gray-500 text-2xl font-bold outline-none w-full"
                              />
                              <div className="text-gray-400">$0.00</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative bg-[#302B52] rounded-full">
                              <div className="w-5 h-5 border-2 border-[#282440] absolute bottom-0 right-[-4px] bg-[#302B52] rounded-full"></div>
                            </div>
                            <div className=" ">
                              <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="bg-transparent text-gray-500 text-2xl font-bold outline-none w-full"
                              />
                              <div className="text-gray-400">$0.00</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Optional Wallet Field */}
                    {showWalletField && (
                      <div className="bg-[#24203D] p-4 rounded-lg">
                        <div className="text-white text-sm">Send to wallet</div>

                        <div className="flex items-center gap-3 mt-2">
                          <div className="w-10 h-10 relative bg-[#302B52] rounded-full">
                            <div className="w-5 h-5 border-2 border-[#282440] absolute bottom-0 right-[-4px] bg-[#302B52] rounded-full"></div>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter wallet address"
                            className="bg-transparent text-white outline-none w-full mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Connect Wallet Button */}
                    <div className="flex gap-2">
                      <button className="flex-1 font-[500] bg-[#543188] text-white py-3 px-6 rounded-3xl">
                        Connect wallet
                      </button>
                      <button
                        className="bg-[#543188] p-3 rounded-3xl"
                        onClick={() => setShowWalletField(!showWalletField)}
                      >
                        <Wallet className="text-white w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : view === "settings" ? (
                <div>
                  <div className="absolute left-4 top-6 gap-4 mb-6">
                    <ArrowLeft
                      className="text-white cursor-pointer"
                      onClick={() => setView("main")}
                    />
                  </div>
                  <h2 className="text-white font-bold text-center text-xl">
                    Settings
                  </h2>
                  {/* Settings content */}
                  <div className="mt-2">
                    <div className="bg-[#24203D] p-4 rounded-lg flex items-center justify-between border mb-2 border-[#302B52]">
                      <div className="flex text-white  items-center gap-3">
                        <Route className="rotate-90" />
                        <p className="text-lg">Route Priority</p>
                      </div>
                      <p className="text-lg">Best Return</p>
                    </div>
                    <div className="bg-[#24203D] p-4 rounded-lg flex items-center justify-between border mb-2 border-[#302B52]">
                      <div className="flex text-white  items-center gap-3">
                        <Fuel className="" />
                        <p className="text-lg">Gas Price</p>
                      </div>
                      <p className="text-lg">Normal</p>
                    </div>
                    <div className="bg-[#24203D] p-4 rounded-lg flex items-center justify-between border mb-2 border-[#302B52]">
                      <div className="flex text-white  items-center gap-3">
                        <Percent className="" />
                        <p className="text-lg">Max. slippage</p>
                      </div>
                      <p className="text-lg">0.5%</p>
                    </div>
                    <div className="bg-[#24203D] p-4 rounded-lg flex items-center justify-between border mb-2 border-[#302B52]">
                      <div className="flex text-white  items-center gap-3">
                        <TrendingUp className="" />
                        <p className="text-lg">Bridges</p>
                      </div>
                      <p className="text-lg">20/20</p>
                    </div>
                    <div className="bg-[#24203D] p-4 rounded-lg flex items-center justify-between border mb-2 border-[#302B52]">
                      <div className="flex text-white  items-center gap-3">
                        <ArrowRightLeft className="r" />
                        <p className="text-lg">Exchanges</p>
                      </div>
                      <p className="text-lg">32/32</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <ArrowLeft
                      className="text-white cursor-pointer"
                      onClick={() => setView("main")}
                    />
                    <h2 className="text-white text-xl">
                      {mode === "exchange" ? "Exchange" : "Gas"} {view}
                    </h2>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by token name or address"
                      className="w-full bg-[#24203D] text-white pl-10 pr-4 py-2 rounded-lg outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {renderTokenList()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </JumperLayout>
  );
}
