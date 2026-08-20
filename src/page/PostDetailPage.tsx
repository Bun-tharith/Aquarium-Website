import PostDetailComponent from "../components/PostDetailComponent";
import { SidebarComponent } from "../components/SideBarComponent";

export default function PostDetailPage() {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-900 lg:flex-row">
            <SidebarComponent />

            <main className="min-h-0 flex-1 overflow-y-auto p-4 transition-colors duration-300 sm:p-6 lg:p-8">
                <PostDetailComponent/>
            </main>
        </div>
    );
}