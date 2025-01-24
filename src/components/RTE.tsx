"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import Editor from "@uiw/react-md-editor";

const DynamicRTE = dynamic(
    () =>
        import("@uiw/react-md-editor").then((mod) => {
            return mod.default;
        }),
    { ssr: false }
);
const MarkdownPreview = ({ source }: { source: string }) => {
    const { theme } = useTheme(); // Detect the current theme

    return (
        <div
            className={`prose max-w-none rounded-lg p-4 ${
                theme === "dark"
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-black"
            }`}
            style={
                {
                    "--color-pre-background": theme === "dark" ? "#1E293B" : "#F3F4F6",
                    "--color-pre-color": theme === "dark" ? "#FFFFFF" : "#000000",
                } as React.CSSProperties
            }
        >
            <Editor.Markdown
                source={source}
                style={{
                    backgroundColor: theme === "dark" ? "#1E293B" : "#F3F4F6",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                }}
            />
        </div>
    );
};


const ThemedRTE = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) => {
    const { theme } = useTheme(); // Detect the current theme

    return (
        <div
            data-color-mode={theme}
            className={`rounded-lg border p-4 ${
                theme === "dark"
                    ? "bg-slate-900 text-white border-white/20"
                    : "bg-gray-100 text-black border-gray-300"
            }`}
        >
            <DynamicRTE
                value={value}
                onChange={(value) => {
                    if (value !== undefined) {
                        onChange(value);
                    }
                }}
                className="prose min-h-[200px]"
                style={{
                    backgroundColor: theme === "dark" ? "#1E293B" : "#F3F4F6",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                }}
            />
        </div>
    );
};

// Export both RTE and MarkdownPreview
const RTE = ThemedRTE;
export { MarkdownPreview };
export default RTE;
