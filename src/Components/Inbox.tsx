"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchNotifications } from "../services/notifications";
import { Notification, getTopPriorityNotifications } from "../logging_midd/priority";
import { FiCheckSquare, FiSquare, FiAlertCircle } from "react-icons/fi";
import Navbar from "./Navbar";

export default function Inbox() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("All");
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedViewed = localStorage.getItem("viewedNotifications");
      if (storedViewed) {
        try {
          return new Set<string>(JSON.parse(storedViewed));
        } catch (e) {
          // ignore parse errors
        }
      }
    }
    return new Set<string>();
  });

  useEffect(() => {
    const tokenData = localStorage.getItem("auth_token");
    if (!tokenData) {
      window.location.href = "/login";
      return;
    }
    
    let token;
    try {
      const parsed = JSON.parse(tokenData);
      token = parsed.access_token || parsed; // handles string or object
    } catch (_e) {
      token = tokenData;
    }

    fetchNotifications({ token })
      .then(data => setNotifications(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleFilterChange = (newFilter: string) => {
    setFilterType(newFilter);
  };

  const markAsViewed = (id: string) => {
    if (!viewedIds.has(id)) {
      const newSet = new Set(viewedIds).add(id);
      setViewedIds(newSet);
      localStorage.setItem("viewedNotifications", JSON.stringify(Array.from(newSet)));
    }
  };

  const markAllAsViewed = () => {
    const newSet = new Set(notifications.map(n => n.ID));
    setViewedIds(newSet);
    localStorage.setItem("viewedNotifications", JSON.stringify(Array.from(newSet)));
  };

  const getTypeStyles = (type: string, isViewed: boolean) => {
    let colorClass = "border-white text-white";
    if (!isViewed) {
      switch (type) {
        case "Placement": colorClass = "border-green-500 text-green-500"; break;
        case "Result": colorClass = "border-yellow-500 text-yellow-500"; break;
        case "Event": colorClass = "border-blue-500 text-blue-500"; break;
        default: colorClass = "border-white text-white"; break;
      }
    } else {
      colorClass = "border-gray-600 text-gray-500";
    }
    return colorClass;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-mono text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="border-2 border-white p-6 animate-pulse">
            <span className="font-bold uppercase tracking-widest">[ SYSTEM PROCESSING... ]</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black font-mono text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="border-2 border-red-500 text-red-500 p-6 flex items-center gap-4">
            <FiAlertCircle className="w-8 h-8" />
            <span className="font-bold uppercase tracking-widest">ERROR: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !viewedIds.has(n.ID));
  const priorityNotifications = getTopPriorityNotifications(unreadNotifications, 10);

  const displayedNotifications = filterType === "All" 
    ? notifications 
    : notifications.filter(n => n.Type === filterType);

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const isViewed = viewedIds.has(notification.ID);
    const typeStyles = getTypeStyles(notification.Type, isViewed);
    
    return (
      <div 
        onClick={() => markAsViewed(notification.ID)}
        className={`border-2 p-4 mb-4 cursor-pointer transition-none flex flex-col md:flex-row md:items-start justify-between gap-4
          ${isViewed 
            ? 'border-gray-800 bg-black text-gray-500 hover:border-gray-600' 
            : 'border-white bg-black hover:bg-white hover:text-black group'
          }`}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">
            {isViewed ? <FiCheckSquare className="w-5 h-5" /> : <FiSquare className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold uppercase tracking-widest border px-2 py-0.5 ${typeStyles} ${!isViewed ? 'group-hover:border-black group-hover:text-black' : ''}`}>
                {notification.Type}
              </span>
              {!isViewed && (
                <span className="text-xs font-bold uppercase tracking-widest bg-white text-black px-2 py-0.5 group-hover:bg-black group-hover:text-white">
                  NEW
                </span>
              )}
            </div>
            <p className={`font-bold uppercase tracking-wide leading-relaxed ${isViewed ? 'text-gray-500' : 'text-white group-hover:text-black'}`}>
              {notification.Message}
            </p>
          </div>
        </div>
        <div className="md:text-right mt-2 md:mt-0 flex-shrink-0">
          <span className={`text-xs font-bold uppercase tracking-widest ${isViewed ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            {new Date(notification.Timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black font-mono text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Controls */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <div className="bg-white text-black font-bold uppercase tracking-widest py-2 px-4 mb-4 border-2 border-white">
              INBOX CONTROLS
            </div>
            
            <button 
              onClick={markAllAsViewed}
              disabled={unreadNotifications.length === 0}
              className="w-full text-left font-bold uppercase tracking-widest p-3 border-2 border-white hover:bg-white hover:text-black transition-none disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              [ MARK ALL READ ]
            </button>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Filters</div>
              {["All", "Event", "Result", "Placement"].map(filter => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`w-full text-left font-bold uppercase tracking-widest p-2 border-2 transition-none flex justify-between items-center
                    ${filterType === filter 
                      ? 'border-white bg-white text-black' 
                      : 'border-transparent text-gray-400 hover:border-gray-600'
                    }`}
                >
                  <span>{filter}</span>
                  {filter === "All" && <span className="text-xs">[{notifications.length}]</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-gray-800 p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">SYSTEM STATUS</div>
            <div className="text-sm font-bold text-green-500">ONLINE / SECURE</div>
            <div className="text-xs text-gray-500 mt-2">UNREAD: {unreadNotifications.length}</div>
          </div>
        </div>

        {/* Main Inbox Area */}
        <div className="flex-1">
          
          {priorityNotifications.length > 0 && filterType === "All" && (
            <div className="mb-12">
              <div className="border-b-2 border-white pb-2 mb-6 flex justify-between items-end">
                <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
                  PRIORITY ALERT
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest text-red-500 border border-red-500 px-2 py-1">
                  CRITICAL: {priorityNotifications.length}
                </span>
              </div>
              
              <div className="space-y-0">
                {priorityNotifications.map(notification => (
                  <NotificationCard key={`priority-${notification.ID}`} notification={notification} />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="border-b-2 border-white pb-2 mb-6 flex justify-between items-end">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
                {filterType === "All" ? "STANDARD INBOX" : `${filterType} LOGS`}
              </h2>
            </div>

            {displayedNotifications.length === 0 ? (
              <div className="border-2 border-dashed border-gray-600 p-12 text-center text-gray-500 font-bold uppercase tracking-widest">
                NO LOGS FOUND FOR [{filterType}]
              </div>
            ) : (
              <div className="space-y-0">
                {displayedNotifications.map(notification => (
                  <NotificationCard key={notification.ID} notification={notification} />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
