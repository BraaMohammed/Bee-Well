
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { CalendarCheck } from "lucide-react";
import { Archive } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Bookmark } from "lucide-react";
import { NotebookText } from "lucide-react";
import { MessageCircle, ChevronDown } from "lucide-react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RiArrowDropDownLine } from "react-icons/ri";
import { getLabels, GetLabelsResult } from "@/actions/getLabels";
import Button from "./Button";
import CardFocusedDialog from "./notes/CardFocusedDialog";
import RecentChatsDropdown from "./RecentChatsDropdown";

interface NewSidebarProps {
  refreshFunction?: () => void;
}
// Menu items (AI Agent removed as it's now handled by RecentChatsDropdown)
const items = [
  {
    title: "Notes",
    url: "/",
    icon: NotebookText,
  },
  {
    title: "Habit Tracker",
    url: "/habit-test",
    icon: CalendarCheck,
  },
  {
    title: "Journal",
    url: "/journal",
    icon: Bookmark,
  },
  {
    title: "Archive",
    url: "/notes/archived",
    icon: Archive,
  },
  {
    title: "Deleted Notes",
    url: "/notes/deleted",
    icon: Trash2,
  },
]

export default function NewSidebar({ refreshFunction }: NewSidebarProps = {}) {
  const { data: session } = useSession();
  const [labelIsClicked, setLabelIsClicked] = useState(false);
  const [labels, setLabels] = useState<GetLabelsResult>([]);
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  let userName = session?.user?.name;
  let userPhoto = session?.user?.image;

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const labelsFromDb = await getLabels();
        setLabels(labelsFromDb);
      } catch (err) {
        console.log("Failed to fetch labels:", err);
      }
    };
    fetchLabels();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
    if (refreshFunction) {
      refreshFunction();
    }
  };

  return (
    <>
      <Sidebar className="bg-neutral-700 border-none shadow-2xl">
        {/* Header with Logo */}
        <SidebarHeader className="p-4 pt-4 pb-6 flex flex-col items-center justify-center space-y-0.5">
          <div className="relative">
            <Image 
              src="/logo.png" 
              alt="logo" 
              width={120} 
              height={120} 
              quality={100}
              className="filter brightness-110 transition-transform duration-300 hover:scale-105" 
            />
          </div>
        {/* 
         <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-emerald-500 bg-clip-text text-transparent" >
            Bee Well
          </h1>  
         */} 
          </SidebarHeader>

        <SidebarContent className="px-3 flex-1 overflow-y-auto">
          {/* Add Note Button */}
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => setIsNewNoteDialogOpen(true)}
              className="w-full max-w-36 flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium active:scale-95 transition-all duration-300 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl border border-green-500/30"
            >
              Add Note <IoIosAddCircleOutline size={16} />
            </button>
          </div>

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="list-none">
                    <SidebarMenuButton 
                      asChild 
                      className="text-white/90 hover:text-white hover:bg-neutral-600/50 p-2 h-auto justify-start !rounded-lg gap-3 transition-all duration-200 border-none outline-none"
                    >
                      <a href={item.url} className="flex items-center gap-3 no-underline">
                        <div className="flex-shrink-0">
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* AI Agent with Chat History */}
                <SidebarMenuItem className="list-none">
                  <div 
                    onClick={() => router.push('/ai-chat')}
                    className="text-white/90 hover:text-white hover:bg-neutral-600/50 p-2 h-auto justify-start !rounded-lg gap-3 transition-all duration-200 border-none outline-none flex items-center cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <MessageCircle size={18} />
                    </div>
                    <span className="text-sm font-medium flex-1">AI Agent</span>
                    <ChevronDown 
                      className={`transition-transform duration-200 ${false ? 'rotate-180' : ''}`} 
                      size={18} 
                    />
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="mt-1 ml-2 flex flex-col gap-1">
                    {(() => {
                      const recentChats: any[] = [];
                      return recentChats.length === 0 ? (
                        <div className="text-xs text-center w-full rounded-lg px-2 py-1.5 text-white/60 font-medium">
                          No chat history yet
                        </div>
                      ) : (
                        recentChats.map((chat: any) => (
                          <div
                            key={chat.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/ai-chat?chatId=${chat.id}`);
                            }}
                            className="text-xs w-full hover:bg-neutral-600/50 rounded-lg px-2 py-1.5 cursor-pointer text-white/80 hover:text-white transition-all duration-200 font-medium border border-transparent hover:border-neutral-500/30 truncate"
                          >
                            {chat.title}
                          </div>
                        ))
                      );
                    })()}
                  </div>
                </SidebarMenuItem>
                
                {/* Labels Section Integrated */}
                <SidebarMenuItem className="list-none">
                  <div 
                    onClick={() => setLabelIsClicked(!labelIsClicked)} 
                    className="text-white/90 hover:text-white hover:bg-neutral-600/50 p-2 h-auto justify-start !rounded-lg gap-3 transition-all duration-200 border-none outline-none flex items-center cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <Bookmark size={18} />
                    </div>
                    <span className="text-sm font-medium flex-1">My Labels</span>
                    <RiArrowDropDownLine 
                      className={`transition-transform duration-200 ${labelIsClicked ? 'rotate-180' : ''}`} 
                      size={18} 
                    />
                  </div>
                </SidebarMenuItem>

                {labelIsClicked && (
                  <div className="flex flex-col gap-1">
                    {labels
                      .filter(label => label.name !== "archived" && label.name !== "deleted")
                      .map(label => (
                        <div
                          key={label.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/notes/${label.id}`);
                          }}
                          className="text-xs text-center w-full hover:bg-neutral-600/50 rounded-lg px-2 py-1.5 cursor-pointer text-white/80 hover:text-white transition-all duration-200 font-medium border border-transparent hover:border-neutral-500/30"
                        >
                          {label.name}
                        </div>
                      ))
                    }
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer with User Info */}
        <SidebarFooter className="p-3 border-t border-neutral-500/30 flex flex-col justify-center items-center">
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="flex items-center gap-2 w-full justify-center">
              <div className="relative">
                <Image 
                  src={userPhoto || "/don.jpg"} 
                  alt="User Photo" 
                  width={36} 
                  height={36} 
                  className="size-9 rounded-full object-cover ring-2 ring-white/20 shadow-lg transition-all duration-300 hover:ring-white/40" 
                />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white/90">{userName}</p>
              </div>
            </div>
            <div className="w-full">
              <Button text="Sign Out" icon="signOut" color="bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/30" />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* CardFocusedDialog for creating new notes */}
      {isNewNoteDialogOpen && (
        <CardFocusedDialog
          setCurrentHtmlNoteContent={() => {}}
          isNewNote={true}
          intialContentFocused={null}
          id={null}
          headingContentFromTheDb=""
          refreshFunction={handleRefresh}
          labelFromDb=""
          backgroundColorFromDb="rgb(64 64 64)"
          dateFromDb=""
          setCurrentHeading={() => {}}
          currentHtmlContent=""
          setCardBackgroundColor={() => {}}
          setCurrentCardLabel={() => {}}
          open={isNewNoteDialogOpen}
          onOpenChange={setIsNewNoteDialogOpen}
        />
      )}
    </>
  )
}