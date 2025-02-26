import { useStatusStore } from "@/store/status";
import Timer from "../timer";

function AppFooter() {
    const status = useStatusStore((state) => state.status);
    return (
        <footer className="border-t px-4 py-1">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className='text-gray-500'>
                    {status}
                </div>
                <div className='text-gray-500'>
                    <Timer />
                </div>
            </div>
        </footer>
    )
}

export default AppFooter;