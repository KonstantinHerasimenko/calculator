import { cn } from "@/utils/css";
import { ComponentPropsWithoutRef } from "react";


export default function Button({className,children,...props}:ComponentPropsWithoutRef<"button">){
  return (
		<button
			className={cn(className, 'bg-gray-300 dark:bg-gray-700 p-2 aspect-[1/1]', "md:hover:m-[0.125rem] md:hover:bg-gray-400 md:dark:hover:bg-gray-800 ease-in-out duration-500")}
			{...props}>
			{children}
		</button>
	)
}