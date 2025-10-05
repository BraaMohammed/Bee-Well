
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { NotebookPen } from "lucide-react";
import { NotebookText } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { IoIosAddCircleOutline } from "react-icons/io";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RiArrowDropDownLine } from "react-icons/ri";
import { getLabels, GetLabelsResult } from "@/actions/getLabels";
import Button from "./Button";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarMobile from "../../z-deprecated/SidebarMobile";
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
  const isMobile = useIsMobile();

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

  // Show mobile sidebar on mobile devices
  if (isMobile) {
    return <SidebarMobile userPhoto={userPhoto} refreshFunction={refreshFunction || (() => {})} labels={labels} />;
  }

  return (
    <>
      <Sidebar className="bg-gradient-to-br from-neutral-600 to-neutral-800 border-none shadow-2xl">
        {/* Header with Logo */}
        <SidebarHeader className="p-6 pt-6 pb-8 flex flex-col items-center justify-center space-y-0.5">
          <div className="relative">
            <Image 
              src="/logo.png" 
              alt="logo" 
              width={150} 
              height={150} 
              quality={100}
              className="filter brightness-110" 
             // style={{filter: 'brightness(1.1) drop-shadow(0 25px 25px rgba(0, 0, 0, 0.5)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.3))'}}
            />
          </div>
        {/*
         <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-emerald-500 bg-clip-text text-transparent" >
            Bee Well
          </h1>  
         */} 
          </SidebarHeader>

        <SidebarContent className="px-4 flex-1 overflow-y-auto">
          {/* Add Note Button */}
          <div className="flex justify-center mb-6">
            <button 
              onClick={() => setIsNewNoteDialogOpen(true)}
              className="w-full max-w-40 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:from-green-500 hover:to-green-600 active:scale-95 transition-all duration-300 bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl"
            >
              Add Note <IoIosAddCircleOutline size={18} />
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
                      className="text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800/50 hover:to-neutral-700/50 p-3 h-auto justify-start !rounded-xl gap-3 transition-all duration-200 border-none outline-none"
                    >
                      <a href={item.url} className="flex items-center gap-3 no-underline">
                        <div className="flex-shrink-0">
                          <item.icon size={20} />
                        </div>
                        <span className="text-base font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* AI Agent with Chat History */}
                <SidebarMenuItem className="list-none">
                  <RecentChatsDropdown 
                    onNavigateToChat={(chatId) => {
                      router.push(`/ai-chat?chatId=${chatId}`);
                    }}
                  />
                </SidebarMenuItem>
                
                {/* Labels Section Integrated */}
                <SidebarMenuItem className="list-none">
                  <div 
                    onClick={() => setLabelIsClicked(!labelIsClicked)} 
                    className="text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-neutral-800/50 hover:to-neutral-700/50 p-3 h-auto justify-start !rounded-xl gap-3 transition-all duration-200 border-none outline-none flex items-center cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <Bookmark size={20} />
                    </div>
                    <span className="text-base font-medium flex-1">My Labels</span>
                    <RiArrowDropDownLine 
                      className={`transition-transform duration-200 ${labelIsClicked ? 'rotate-180' : ''}`} 
                      size={20} 
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
                          className="text-sm text-center w-full hover:bg-gradient-to-r hover:from-neutral-500/50 hover:to-neutral-600/50 rounded-xl px-3 py-2 cursor-pointer text-white/80 hover:text-white transition-all duration-200 font-medium"
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
        <SidebarFooter className="p-4 border-t border-neutral-500/30 flex flex-col justify-center items-center">
          <div className="flex flex-col gap-3 items-center">
            <div className="flex items-center gap-3 w-full justify-center">
              <div className="relative">
                <Image 
                  src={userPhoto || "/don.jpg"} 
                  alt="User Photo" 
                  width={40} 
                  height={40} 
                  className="size-10 rounded-full object-cover ring-2 ring-white/20 shadow-lg" 
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/90">{userName}</p>
              </div>
            </div>
            <div className="w-full">
              <Button text="Sign Out" icon="signOut" color="bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800" />
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