"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Send,
    RefreshCw,
    Image as ImageIcon,
    Lock,
    Eye,
    EyeOff,
    ChevronLeft,
    Trash2,
    Upload,
    CheckCircle,
    AlertCircle,
    Copy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import slugify from "slugify";
import Lightbox from "@/components/Lightbox";

// ── Shared MDX components for Client Preview ──────────────────────────────
const mdxComponents = {
    img: (props: any) => <Lightbox {...props} />,
    h1: (props: any) => <h1 className="text-xl font-mono font-bold text-cyber-green mt-4 mb-2 border-b border-cyber-green/20 pb-1" {...props} />,
    h2: (props: any) => <h2 className="text-lg font-mono font-bold text-cyber-blue mt-4 mb-2" {...props} />,
    h3: (props: any) => <h3 className="text-md font-mono font-bold text-cyber-pink mt-3 mb-1" {...props} />,
    p: (props: any) => <p className="text-gray-300 leading-relaxed mb-3 text-sm" {...props} />,
    a: (props: any) => (
        <a className="text-cyber-blue hover:text-cyber-green underline underline-offset-4 transition-colors text-sm" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    ul: (props: any) => <ul className="list-none space-y-1 mb-3 ml-2 text-sm" {...props} />,
    li: (props: any) => (
        <li className="relative pl-4" {...props}>
            <span className="absolute left-0 text-cyber-green">{">"}</span>
            {props.children}
        </li>
    ),
    pre: ({ children }: any) => <pre className="bg-cyber-gray/10 p-3 border border-cyber-gray/30 my-3 overflow-x-auto text-xs">{children}</pre>,
    code: ({ children, className }: any) => <code className={className || "bg-cyber-gray/20 px-1 py-0.5 rounded text-cyber-pink"}>{children}</code>,
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
    title: string;
    content: string;
    description: string;
    type: string;
    platform: string;
    difficulty: string;
    status: string;
    password: string;
    tags: string;
    githubUrl: string;
    demoUrl: string;
}

interface ToastState {
    type: "success" | "error" | "info";
    message: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const POST_TYPES = ["WRITEUP", "PROJECT", "CVE", "OWASP", "INSIGHT"] as const;
const PLATFORMS = ["HTB", "THM", "CTF", "N/A"] as const;
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Insane"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "LOCKED"] as const;
const AUTO_SAVE_DELAY = 15_000; // 15 seconds

// ─── Toast Component ────────────────────────────────────────────────────────
function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    const colours =
        toast.type === "success"
            ? "border-cyber-green text-cyber-green bg-cyber-green/5"
            : toast.type === "error"
                ? "border-red-500 text-red-400 bg-red-500/5"
                : "border-cyber-blue text-cyber-blue bg-cyber-blue/5";

    const Icon = toast.type === "success" ? CheckCircle : toast.type === "error" ? AlertCircle : RefreshCw;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 border font-mono text-xs ${colours} transition-all`}
        >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
interface InitialData {
    title?: string | null;
    content?: string | null;
    description?: string | null;
    type?: string | null;
    platform?: string | null;
    difficulty?: string | null;
    status?: string | null;
    password?: string | null;
    tags?: string | null;
    githubUrl?: string | null;
    demoUrl?: string | null;
    thumbnail?: string | null;
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
}

export default function ContentEditor({
    initialData,
    id,
}: {
    initialData?: InitialData;
    id?: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState<"draft" | "publish" | "update" | null>(null);
    const [preview, setPreview] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [formData, setFormData] = useState<FormState>({
        title: initialData?.title || "",
        content: initialData?.content || "",
        description: initialData?.description || "",
        type: initialData?.type || "WRITEUP",
        platform: initialData?.platform || "HTB",
        difficulty: initialData?.difficulty || "Easy",
        status: initialData?.status || "DRAFT",
        password: "",
        tags: initialData?.tags || "",
        githubUrl: initialData?.githubUrl || "",
        demoUrl: initialData?.demoUrl || "",
    });

    const [thumbnail, setThumbnail] = useState<File | null>(null);

    // Computed slug
    const slug = formData.title
        ? slugify(formData.title, { lower: true, strict: true })
        : "";

    // ── Toast helper ──────────────────────────────────────────────────────────
    const showToast = useCallback((type: ToastState["type"], message: string) => {
        setToast({ type, message });
    }, []);

    // ── API call helper ───────────────────────────────────────────────────────
    // ── Generate Preview for newly selected thumbnail ────────────────────────
    useEffect(() => {
        if (!thumbnail) {
            setThumbnailPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(thumbnail);
        setThumbnailPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [thumbnail]);

    const submitContent = useCallback(
        async (statusOverride?: string) => {
            const targetStatus = statusOverride ?? formData.status;
            const actionLabel =
                statusOverride === "DRAFT"
                    ? "draft"
                    : statusOverride === "PUBLISHED"
                        ? "publish"
                        : "update";

            setLoading(
                statusOverride === "DRAFT"
                    ? "draft"
                    : statusOverride === "PUBLISHED"
                        ? "publish"
                        : "update"
            );

            const data = new FormData();
            const payload = { ...formData, status: targetStatus, password: formData.password.trim() };
            (Object.keys(payload) as (keyof FormState)[]).forEach((key) => {
                const val = payload[key];
                if (val !== null && val !== undefined && val !== "") {
                    data.append(key, val);
                }
            });
            if (id) data.append("id", id);
            if (thumbnail) data.append("thumbnail", thumbnail);

            try {
                const res = await fetch("/api/admin/content", {
                    method: id ? "PUT" : "POST",
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                    body: data,
                });

                if (res.ok) {
                    await res.json();
                    setLastSaved(new Date());
                    showToast("success", `POST_${actionLabel.toUpperCase()}_OK — redirecting…`);
                    setTimeout(() => {
                        router.push("/admin/content");
                        router.refresh();
                    }, 1200);
                } else {
                    const err = await res.json().catch(() => ({}));
                    showToast("error", `SAVE_FAILED: ${err.error || res.statusText}`);
                }
            } catch {
                showToast("error", "NETWORK_FAILURE: Check connection");
            } finally {
                setLoading(null);
            }
        },
        [formData, id, thumbnail, router, showToast]
    );

    // ── Auto-save every 15s (drafts only if not published) ────────────────────
    useEffect(() => {
        if (!formData.title || !id) return; // Only auto-save existing drafts

        const timer = setInterval(async () => {
            if (formData.status === "DRAFT") {
                const data = new FormData();
                (Object.keys(formData) as (keyof FormState)[]).forEach((key) => {
                    const val = formData[key];
                    if (val !== null && val !== undefined && val !== "") {
                        data.append(key, val);
                    }
                });
                data.append("id", id!);

                try {
                    const res = await fetch("/api/admin/content", {
                        method: "PUT",
                        headers: { "X-Requested-With": "XMLHttpRequest" },
                        body: data,
                    });
                    if (res.ok) setLastSaved(new Date());
                } catch {
                    // Silent fail for auto-save
                }
            }
        }, AUTO_SAVE_DELAY);

        return () => clearInterval(timer);
    }, [formData, id]);

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!confirm("CONFIRM_DELETION: This post will be permanently removed.")) return;
        setLoading("update");
        try {
            const res = await fetch("/api/admin/content", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                showToast("success", "POST_DELETED");
                setTimeout(() => router.push("/admin/content"), 800);
            } else {
                showToast("error", "DELETE_FAILED");
            }
        } catch {
            showToast("error", "DELETE_FAILED: Network error");
        } finally {
            setLoading(null);
        }
    };

    // ── Image Upload ───────────────────────────────────────────────────────────
    const handleImageUpload = async (file: File) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            showToast("error", "INVALID_TYPE: Only .jpg, .png, .webp allowed");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast("error", "FILE_TOO_LARGE: Max 2MB");
            return;
        }

        setUploadingImage(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                headers: { "X-Requested-With": "XMLHttpRequest" },
                body: data,
            });
            const json = await res.json();
            if (res.ok && json.url) {
                const mdSnippet = `![image](${json.url})`;
                
                // ── Insert at cursor position ── 
                const textarea = textareaRef.current;
                if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = formData.content;
                    const before = text.substring(0, start);
                    const after = text.substring(end);
                    const newValue = before + (before.endsWith('\n') || before === '' ? '' : '\n') + mdSnippet + (after.startsWith('\n') ? '' : '\n') + after;
                    
                    setFormData((prev) => ({
                        ...prev,
                        content: newValue,
                    }));
                } else {
                    // Fallback to append
                    setFormData((prev) => ({
                        ...prev,
                        content: prev.content + "\n" + mdSnippet,
                    }));
                }
                
                showToast("success", `IMAGE_UPLOADED → ${json.url}`);
            } else {
                showToast("error", `UPLOAD_FAILED: ${json.error}`);
            }
        } catch {
            showToast("error", "UPLOAD_FAILED: Network error");
        } finally {
            setUploadingImage(false);
        }
    };

    // ── Drag & Drop on editor ─────────────────────────────────────────────────
    const handleEditorDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) await handleImageUpload(file);
    };

    // ── Copy slug ─────────────────────────────────────────────────────────────
    const copySlug = () => {
        navigator.clipboard.writeText(slug);
        showToast("info", "SLUG_COPIED");
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="w-full flex-col font-mono selection:bg-cyber-blue selection:text-black mt-0 h-auto md:h-full">
            {/* ── Top Bar ── */}
            <div className="sticky top-0 z-40 border-b border-cyber-gray bg-cyber-black/95 backdrop-blur px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-cyber-gray/20 transition-colors rounded"
                        title="Go back"
                    >
                        <ChevronLeft className="w-5 h-5 text-cyber-blue" />
                    </button>
                    <div>
                        <h1 className="font-mono text-lg font-bold text-white leading-none">
                            {id ? "EDIT_CONTENT" : "NEW_CONTENT"}
                        </h1>
                        {slug && (
                            <button
                                onClick={copySlug}
                                className="flex items-center gap-1 font-mono text-xs text-gray-600 hover:text-cyber-blue transition-colors mt-0.5"
                            >
                                <Copy className="w-2.5 h-2.5" />
                                <span>/{slug}</span>
                            </button>
                        )}
                    </div>
                    {lastSaved && (
                        <span className="hidden md:block font-mono text-[10px] text-gray-700 ml-4">
                            AUTO_SAVED: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Preview toggle */}
                    <button
                        onClick={() => setPreview((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-cyber-gray text-gray-400 font-mono text-xs hover:text-white hover:border-cyber-blue transition-all"
                    >
                        {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{preview ? "EDITOR" : "PREVIEW"}</span>
                    </button>

                    {/* Image upload */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-cyber-gray text-gray-400 font-mono text-xs hover:text-white hover:border-cyber-blue transition-all disabled:opacity-50"
                        title="Upload image & insert markdown"
                    >
                        {uploadingImage ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <ImageIcon className="w-3.5 h-3.5" />
                        )}
                        <span>IMG</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleImageUpload(f);
                            e.target.value = "";
                        }}
                    />

                    {/* Delete (only when editing) */}
                    {id && (
                        <button
                            onClick={handleDelete}
                            disabled={!!loading}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-all disabled:opacity-50"
                            title="Delete post"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {/* Save Draft */}
                    <button
                        onClick={() => submitContent("DRAFT")}
                        disabled={!!loading}
                        className="flex items-center gap-1.5 px-4 py-1.5 border border-cyber-gray text-gray-300 font-mono text-xs font-bold hover:border-white hover:text-white transition-all disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{loading === "draft" ? "SAVING…" : "SAVE_DRAFT"}</span>
                    </button>

                    {/* Publish / Update */}
                    <button
                        onClick={() =>
                            id ? submitContent(formData.status) : submitContent("PUBLISHED")
                        }
                        disabled={!!loading}
                        className="flex items-center gap-1.5 px-5 py-1.5 bg-cyber-blue text-black font-mono text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {id ? <RefreshCw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        <span>
                            {loading === "publish" || loading === "update"
                                ? "PROCESSING…"
                                : id
                                    ? "UPDATE"
                                    : "PUBLISH"}
                        </span>
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-grow flex flex-col">
                {/* Title */}
                <div className="px-6 pt-6 pb-2 border-b border-cyber-gray/30">
                    <input
                        id="content-title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-transparent text-2xl md:text-3xl font-mono font-bold text-white placeholder:text-gray-800 focus:outline-none uppercase tracking-tighter"
                        placeholder="ENTRY_TITLE_HERE…"
                    />
                </div>

                {/* Split Pane */}
                <div className={`flex-grow grid ${preview ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"} md:divide-x divide-y md:divide-y-0 divide-cyber-gray/30 overflow-hidden`} style={{ minHeight: "calc(100vh - 200px)" }}>
                    {/* Editor */}
                    <div className={`${preview ? "col-span-1" : "col-span-1 md:col-span-2"} flex flex-col min-h-[400px]`}>
                        <div className="px-3 py-1.5 bg-cyber-gray/10 border-b border-cyber-gray/30 flex items-center justify-between">
                            <span className="font-mono text-xs text-gray-600 uppercase">Markdown Editor</span>
                            <span className="font-mono text-xs text-gray-700 hidden sm:block">Drop images to embed</span>
                        </div>
                        <textarea
                            id="content-editor"
                            ref={textareaRef}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            onDrop={handleEditorDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex-grow w-full bg-transparent p-5 text-gray-200 font-mono text-base focus:outline-none resize-none leading-relaxed"
                            placeholder={"# Mission Brief\n\nStart writing your content here...\n\n```bash\n# Code blocks are fully supported\n```\n"}
                            spellCheck={false}
                        />
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div className="col-span-1 flex flex-col overflow-hidden min-h-[400px]">
                            <div className="px-3 py-1.5 bg-cyber-blue/5 border-b border-cyber-blue/20">
                                <span className="font-mono text-xs text-cyber-blue uppercase">Live Preview</span>
                            </div>
                            <div className="flex-grow overflow-y-auto p-5 prose prose-invert prose-base max-w-none">
                                <h1 className="text-white font-mono text-xl md:text-2xl mb-6 uppercase tracking-tighter border-b border-cyber-blue pb-4">
                                    {formData.title || "UNTITLED_ENTRY"}
                                </h1>
                                <div className="font-sans leading-relaxed">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={mdxComponents as any}
                                    >
                                        {formData.content || "*No content detected in buffer...*"}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sidebar Metadata (shown only when not in preview) */}
                    {!preview && (
                        <div className="col-span-1 overflow-y-auto p-5 space-y-5 bg-cyber-black/40">
                            {/* ── Post Type ── */}
                            <div>
                                <label className="block font-mono text-sm text-gray-500 mb-2 uppercase tracking-widest">
                                    Post Type
                                </label>
                                <select
                                    id="post-type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-cyber-black border border-cyber-gray p-3 text-cyber-blue font-mono text-base outline-none focus:border-cyber-blue transition-colors appearance-none"
                                >
                                    {POST_TYPES.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ── Status ── */}
                            <div>
                                <label className="block font-mono text-sm text-gray-500 mb-2 uppercase tracking-widest">
                                    Status
                                </label>
                                <div className="grid grid-cols-3 gap-1">
                                    {STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s })}
                                            className={`py-2 text-xs font-mono border transition-all uppercase ${formData.status === s
                                                ? s === "DRAFT"
                                                    ? "bg-gray-600/20 border-gray-400 text-gray-300 shadow-[0_0_10px_rgba(156,163,175,0.1)]"
                                                    : s === "PUBLISHED"
                                                        ? "bg-cyber-green/20 border-cyber-green text-cyber-green shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                                                        : "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                                                : "border-cyber-gray/30 text-gray-700 hover:border-cyber-gray"
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Password (only for LOCKED) ── */}
                            {formData.status === "LOCKED" && (
                                <div className="animate-pulse-once">
                                    <label className="flex items-center gap-1 font-mono text-xs text-red-400 mb-1.5 uppercase">
                                        <Lock className="w-3 h-3" />
                                        Access Key (Password)
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="content-password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-cyber-black border border-red-500/30 p-2 pr-10 text-red-400 font-mono text-xs outline-none focus:border-red-400 transition-colors"
                                            placeholder="ENTER_ACCESS_KEY"
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-500/50 hover:text-red-400"
                                        >
                                            <Lock className={`w-3 h-3 ${showPassword ? "opacity-30" : ""}`} />
                                        </button>
                                    </div>
                                    <p className="font-mono text-[9px] text-gray-700 mt-1">Leave blank to keep existing key.</p>
                                </div>
                            )}

                            {/* ── Platform ── */}
                            <div>
                                <label className="block font-mono text-sm text-gray-500 mb-2 uppercase tracking-widest">
                                    Platform
                                </label>
                                <select
                                    id="post-platform"
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full bg-cyber-black border border-cyber-gray p-3 text-white font-mono text-base outline-none focus:border-cyber-blue transition-colors appearance-none"
                                >
                                    {PLATFORMS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ── Difficulty ── */}
                            <div>
                                <label className="block font-mono text-sm text-gray-500 mb-2 uppercase tracking-widest">
                                    Difficulty
                                </label>
                                <select
                                    id="post-difficulty"
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full bg-cyber-black border border-cyber-gray p-3 text-white font-mono text-base outline-none focus:border-cyber-blue transition-colors appearance-none"
                                >
                                    {DIFFICULTIES.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            {/* ── Tags ── */}
                            <div>
                                <label className="block font-mono text-sm text-gray-500 mb-2 uppercase tracking-widest">
                                    Tags (comma separated)
                                </label>
                                <input
                                    id="content-tags"
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-cyber-black border border-cyber-gray p-3 text-white font-mono text-base outline-none focus:border-cyber-blue transition-colors"
                                    placeholder="XSS, SQLI, RCE, LFI…"
                                />
                            </div>

                            {/* ── Description ── */}
                            <div>
                                <label className="block font-mono text-sm text-gray-500 mb-2 uppercase tracking-widest">
                                    Short Description
                                </label>
                                <textarea
                                    id="content-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-cyber-black border border-cyber-gray p-3 text-white font-mono text-base outline-none focus:border-cyber-blue transition-colors resize-none h-24 leading-relaxed"
                                    placeholder="Brief summary…"
                                />
                            </div>

                            {/* ── Thumbnail ── */}
                            <div>
                                <label className="block font-mono text-xs text-gray-500 mb-1.5 uppercase tracking-wider">
                                    Thumbnail
                                </label>
                                <div className="border border-dashed border-cyber-gray/50 p-4 text-center hover:border-cyber-blue transition-all cursor-pointer relative bg-cyber-gray/5">
                                    <input
                                        type="file"
                                        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/jpeg,image/png,image/webp"
                                    />
                                    <Upload className="w-5 h-5 mx-auto text-gray-700 mb-1" />
                                    <span className="font-mono text-[9px] text-gray-600 block truncate">
                                        {thumbnail
                                            ? thumbnail.name
                                            : initialData?.thumbnail
                                                ? "REPLACE CURRENT"
                                                : "DROP IMAGE ASSET"}
                                    </span>
                                </div>
                                {thumbnailPreview ? (
                                    <img
                                        src={thumbnailPreview}
                                        alt="thumbnail-preview"
                                        className="mt-2 w-full h-24 object-cover border border-cyber-blue shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                                    />
                                ) : initialData?.thumbnail ? (
                                    <img
                                        src={initialData.thumbnail}
                                        alt="thumbnail"
                                        className="mt-2 w-full h-16 object-cover border border-cyber-gray/20 opacity-60"
                                    />
                                ) : null}
                            </div>

                            {/* ── Project-specific ── */}
                            {formData.type === "PROJECT" && (
                                <>
                                    <div>
                                        <label className="block font-mono text-xs text-gray-500 mb-1.5 uppercase">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                            className="w-full bg-cyber-black border border-cyber-gray p-2 text-white font-mono text-xs outline-none focus:border-cyber-blue"
                                            placeholder="https://github.com/…"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-mono text-xs text-gray-500 mb-1.5 uppercase">
                                            Demo URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.demoUrl}
                                            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                                            className="w-full bg-cyber-black border border-cyber-gray p-2 text-white font-mono text-xs outline-none focus:border-cyber-blue"
                                            placeholder="https://demo.com/…"
                                        />
                                    </div>
                                </>
                            )}

                            {/* ── Slug preview ── */}
                            {slug && (
                                <div className="pt-4 border-t border-cyber-gray/20">
                                    <label className="block font-mono text-[10px] text-gray-600 mb-1 uppercase">
                                        Generated Slug
                                    </label>
                                    <p className="font-mono text-[10px] text-gray-500 break-all">
                                        <span className="text-gray-700">/writeups/</span>{slug}
                                    </p>
                                </div>
                            )}

                            {/* ── CreatedAt / UpdatedAt ── */}
                            {initialData && (
                                <div className="pt-2 border-t border-cyber-gray/20 space-y-1">
                                    {initialData.createdAt && (
                                        <p className="font-mono text-[9px] text-gray-700">
                                            CREATED: {new Date(initialData.createdAt).toLocaleString()}
                                        </p>
                                    )}
                                    {initialData.updatedAt && (
                                        <p className="font-mono text-[9px] text-gray-700">
                                            UPDATED: {new Date(initialData.updatedAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Toast Notification ── */}
            {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
        </div>
    );
}
