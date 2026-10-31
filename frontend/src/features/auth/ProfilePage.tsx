import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  ArrowRight,
  Shield,
  Phone
} from "lucide-react";
import { useShop } from "../../context/ShopContext";
import { orderService } from "../../services/orderService";
import type { AddressDto } from "../../types/order";
import { EGYPT_GOVERNORATES } from "../../types/cart";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useShop();

  const [activeTab, setActiveTab] = useState<"addresses" | "orders" | "account">("addresses");
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New address state
  const [newRecipient, setNewRecipient] = useState(user?.fullName || "");
  const [newPhone, setNewPhone] = useState(user?.phoneNumber || "");
  const [newGov, setNewGov] = useState("Cairo (القاهرة)");
  const [newCity, setNewCity] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newBuilding, setNewBuilding] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Load addresses
  const loadAddresses = () => {
    if (isAuthenticated) {
      setIsLoadingAddresses(true);
      orderService
        .getAddresses()
        .then((res) => {
          if (res && Array.isArray(res)) {
            setAddresses(res);
          }
        })
        .finally(() => setIsLoadingAddresses(false));
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [isAuthenticated]);

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError("");

    if (!newRecipient.trim() || !newPhone.trim() || !newStreet.trim() || !newCity.trim()) {
      setAddressError("Please fill out all required fields.");
      return;
    }

    setIsSavingAddress(true);

    try {
      await orderService.createAddress({
        recipientName: newRecipient.trim(),
        phoneNumber: newPhone.trim(),
        city: `${newGov} - ${newCity.trim()}`,
        street: newStreet.trim(),
        buildingNumber: newBuilding.trim() || undefined,
        additionalDetails: newNotes.trim() || undefined,
        isDefault: isDefault || addresses.length === 0
      });

      setShowAddAddressModal(false);
      setNewCity("");
      setNewStreet("");
      setNewBuilding("");
      setNewNotes("");
      loadAddresses();
    } catch (err: any) {
      // Fallback local address if offline
      const mockAddr: AddressDto = {
        id: Date.now(),
        recipientName: newRecipient.trim(),
        phoneNumber: newPhone.trim(),
        city: `${newGov} - ${newCity.trim()}`,
        street: newStreet.trim(),
        buildingNumber: newBuilding.trim() || null,
        additionalDetails: newNotes.trim() || null,
        isDefault: isDefault || addresses.length === 0,
        isLocked: false
      };
      setAddresses([...addresses, mockAddr]);
      setShowAddAddressModal(false);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await orderService.deleteAddress(id);
      loadAddresses();
    } catch {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Sign in to Access Your Account</h2>
          <p className="text-xs text-slate-500 mb-6">
            Manage your hardware orders, delivery locations, and view tax invoices.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              className="px-5 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TX";

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">User Profile</span>
        </nav>

        {/* Profile Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user?.fullName || "Account Member"}</h1>
                {isAdmin ? (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> System Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user?.email || "customer@techxpress.eg"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 flex-wrap">
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 h-11 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-8 gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`pb-4 px-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "addresses"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses ({addresses.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`pb-4 px-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === "account"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Security</span>
          </button>
        </div>

        {/* Tab 1: Delivery Addresses */}
        {activeTab === "addresses" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Saved Delivery Locations
                </h3>
                <p className="text-xs text-slate-500">
                  Manage addresses used for express hardware deliveries across Egypt.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAddressModal(true)}
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {isLoadingAddresses ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm">No Saved Addresses Found</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">Add your home or office delivery address for faster checkout.</p>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(true)}
                  className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900">{addr.recipientName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          Default Destination
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 mb-4 flex-1">
                      <div className="font-semibold text-slate-800">{addr.city}</div>
                      <div>{addr.street} {addr.buildingNumber ? `, Bldg ${addr.buildingNumber}` : ""}</div>
                      {addr.additionalDetails && (
                        <div className="text-[11px] text-slate-400 italic">{addr.additionalDetails}</div>
                      )}
                      <div className="text-slate-500 pt-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{addr.phoneNumber}</span>
                      </div>
                    </div>

                    {!addr.isLocked && (
                      <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs font-bold text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Hardware Order History
                </h3>
                <p className="text-xs text-slate-500">
                  Track shipment status, view invoices, and manage warranty records.
                </p>
              </div>

              <Link
                to="/orders"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Full Orders Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">Review All Your Tech Orders</h4>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
                All order tracking numbers, itemized serial numbers, and delivery milestones are accessible in the dedicated orders viewer.
              </p>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 px-5 h-10 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
              >
                <Package className="w-4 h-4" />
                <span>Go to Orders Page</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tab 3: Account Info */}
        {activeTab === "account" && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base sm:text-lg font-black text-slate-900 pb-4 border-b border-slate-100">
              Account Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-500 block mb-1">Full Legal Name</span>
                <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                  {user?.fullName || "Not provided"}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-1">Email Address</span>
                <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                  {user?.email || "customer@techxpress.eg"}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-1">Security Tier</span>
                <div className="p-3 bg-slate-50 rounded-xl font-bold text-emerald-700 border border-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Protected</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-1">Assigned Role</span>
                <div className="p-3 bg-slate-50 rounded-xl font-bold text-indigo-700 border border-slate-100">
                  {user?.roles?.join(", ") || "Customer"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span>Add Delivery Destination</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {addressError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">
                  {addressError}
                </div>
              )}

              <form onSubmit={handleCreateAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder="Name"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Egyptian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Governorate *
                    </label>
                    <select
                      value={newGov}
                      onChange={(e) => setNewGov(e.target.value)}
                      className="w-full h-10 px-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:outline-none focus:border-indigo-600"
                    >
                      {EGYPT_GOVERNORATES.map((g) => (
                        <option key={g.name} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. New Cairo"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="Street name, landmark"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Building / Floor
                    </label>
                    <input
                      type="text"
                      value={newBuilding}
                      onChange={(e) => setNewBuilding(e.target.value)}
                      placeholder="Bldg 4, Fl 2"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Additional Notes
                    </label>
                    <input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Call on arrival"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="text-xs text-slate-700 font-semibold">
                    Set as default delivery address
                  </span>
                </label>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(false)}
                    className="flex-1 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingAddress}
                    className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer disabled:bg-slate-400"
                  >
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
