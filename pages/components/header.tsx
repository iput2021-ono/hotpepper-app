import React from "react";
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();

    const handleTop= () => {
        router.push({
        pathname: '/',
        });
    }
    return (
        <div className="sticky top-0 border p-4 bg-white text-black">
            <button className="text-xl" onClick={handleTop}>
                <span className="text-red-500 text-2xl font-bold italic">N</span>ear GOHAN
            </button>
        </div>
    );
    
}
