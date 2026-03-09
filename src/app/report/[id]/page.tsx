"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Bookmark,
  BookmarkCheck,
  Download,
  Loader2,
  MessageSquareText,
  Save,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAccessToken } from "@/lib/auth";
import { api } from "@/lib/api/client";

type ReportContent = Record<string, unknown>;

type ReportResponse = {
  report_id: string;
  status: "generating" | "completed" | "failed";
  title: string;
  content: ReportContent | null;
  created_at: string;
  is_bookmarked: boolean;
  progress?: number | null;
  phase?: string | null;
  status_message?: string | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type MarkdownBlock = {
  heading: string;
  body: string;
};

const sectionDefs = [
  { key: "abstract", label: "초록" },
  { key: "introduction", label: "1. 탐구 동기 및 목적" },
  { key: "background", label: "2. 이론적 배경" },
  { key: "methodology", label: "3. 탐구 방법" },
  { key: "analysis", label: "4. 분석 및 해석" },
  { key: "limitations", label: "5. 한계 및 보완점" },
  { key: "conclusion", label: "6. 결론" },
] as const;

const phaseLabelMap: Record<string, string> = {
  queued: "대기열 등록",
  retrieve: "RAG 수집",
  plan: "탐구 계획",
  research: "근거 정리",
  generate: "초안 생성",
  critique: "품질 점검",
  rewrite: "재작성",
  finalize: "최종 정리",
  failed: "실패",
  completed: "완료",
};

const phaseOrder = [
  "queued",
  "retrieve",
  "plan",
  "research",
  "generate",
  "critique",
  "rewrite",
  "finalize",
  "failed",
  "completed",
] as const;

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const isGenerating = report?.status === "generating";

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    let mounted = true;
    let timer: NodeJS.Timeout | null = null;

    const fetchReport = async () => {
      try {
        const res = await api.get<ReportResponse>(`/reports/${reportId}`);
        if (!mounted) return;

        setReport(res);
        const map: Record<string, string> = {};
        for (const section of sectionDefs) {
          const value = res.content?.[section.key];
          if (typeof value === "string") map[section.key] = value;
        }
        setContent((prev) => (Object.keys(prev).length > 0 && isGenerating ? prev : map));
        const markdown = res.content?.final_report_markdown;
        if (typeof markdown === "string") {
          setMarkdownContent((prev) => (isGenerating && prev ? prev : markdown));
        }

        if (res.status === "generating") {
          timer = setTimeout(fetchReport, 2500);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        router.replace("/login");
        setLoading(false);
      }
    };

    fetchReport().catch(console.error);

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [reportId, isGenerating, router]);

  const pipeline = useMemo(() => {
    const p = report?.content?.pipeline;
    return p && typeof p === "object" ? (p as Record<string, unknown>) : null;
  }, [report?.content]);

  const failureInfo = useMemo(() => {
    if (report?.status !== "failed") return "";
    const pipelineObj = report?.content?.pipeline;
    if (pipelineObj && typeof pipelineObj === "object") {
      const pipelineErr = (pipelineObj as Record<string, unknown>).error;
      if (typeof pipelineErr === "string" && pipelineErr.trim()) return pipelineErr;
    }
    const err = report?.content?.error;
    if (typeof err === "string" && err.trim()) return err;
    return "보고서 생성 중 오류가 발생했습니다. 다시 생성해 주세요.";
  }, [report?.status, report?.content]);

  const recoveryInfo = useMemo(() => {
    const pipelineObj = report?.content?.pipeline;
    if (!pipelineObj || typeof pipelineObj !== "object") return null;
    const pipelineRecord = pipelineObj as Record<string, unknown>;
    const style = typeof pipelineRecord.style === "string" ? pipelineRecord.style : "";
    if (style !== "recovery" && style !== "fallback") return null;
    return {
      error: typeof pipelineRecord.error === "string" ? pipelineRecord.error : "",
      failedPhase: typeof pipelineRecord.failed_phase === "string" ? pipelineRecord.failed_phase : "",
    };
  }, [report?.content]);

  const progressMeta = useMemo(() => {
    const direct = {
      progress: typeof report?.progress === "number" ? report.progress : null,
      phase: typeof report?.phase === "string" ? report.phase : "",
      message: typeof report?.status_message === "string" ? report.status_message : "",
    };
    if (direct.progress !== null || direct.phase || direct.message) {
      return direct;
    }
    const meta = report?.content?.__meta;
    if (!meta || typeof meta !== "object") return null;
    const obj = meta as Record<string, unknown>;
    return {
      progress: typeof obj.progress === "number" ? obj.progress : null,
      phase: typeof obj.phase === "string" ? obj.phase : "",
      message: typeof obj.message === "string" ? obj.message : "",
    };
  }, [report?.content, report?.progress, report?.phase, report?.status_message]);

  const currentPhaseLabel = useMemo(() => {
    const phase = (progressMeta?.phase || "").trim();
    if (!phase) return "처리 중";
    return phaseLabelMap[phase] || phase;
  }, [progressMeta?.phase]);

  const currentPhaseIndex = useMemo(() => {
    const phase = (progressMeta?.phase || "").trim() as (typeof phaseOrder)[number] | "";
    const idx = phaseOrder.indexOf(phase as (typeof phaseOrder)[number]);
    return idx >= 0 ? idx : 0;
  }, [progressMeta?.phase]);

  const onSave = async () => {
    if (!report) return;
    setSaving(true);
    try {
      const updatedContent: ReportContent = { ...(report.content || {}) };
      if (markdownContent.trim()) {
        updatedContent.final_report_markdown = markdownContent;
      }
      for (const section of sectionDefs) {
        if (content[section.key]) updatedContent[section.key] = content[section.key];
      }
      const updated = await api.patch<ReportResponse>(`/reports/${report.report_id}`, { content: updatedContent });
      setReport(updated);
      setEditMode(false);
      alert("보고서가 저장되었습니다.");
    } catch (e) {
      console.error(e);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const onToggleBookmark = async () => {
    if (!report) return;
    const next = !report.is_bookmarked;
    try {
      await api.patch(`/reports/${report.report_id}/bookmark`, { is_bookmarked: next });
      setReport({ ...report, is_bookmarked: next });
    } catch (e) {
      console.error(e);
    }
  };

  const onChatSend = async () => {
    const message = chatInput.trim();
    if (!message || !report) return;

    setChatMessages((prev) => [...prev, { role: "user", text: message }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await api.post<{ reply: string }>(`/reports/${report.report_id}/chat`, { message });
      setChatMessages((prev) => [...prev, { role: "assistant", text: res.reply }]);
    } catch (e) {
      console.error(e);
      setChatMessages((prev) => [...prev, { role: "assistant", text: "답변 생성에 실패했습니다." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const escapeHtml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const onDownloadPdf = () => {
    if (!report) return;

    const parseMarkdown = (value: string): MarkdownBlock[] => {
      const src = value.replace(/\r\n/g, "\n").trim();
      if (!src) return [];
      const lines = src.split("\n");
      const blocks: MarkdownBlock[] = [];
      let currentHeading = "";
      let currentBody: string[] = [];
      for (const raw of lines) {
        const line = raw.trimEnd();
        const match = line.match(/^#{1,3}\s+(.+)$/);
        if (match) {
          if (currentHeading || currentBody.join("").trim()) {
            blocks.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
          }
          currentHeading = match[1].trim();
          currentBody = [];
          continue;
        }
        currentBody.push(line);
      }
      if (currentHeading || currentBody.join("").trim()) {
        blocks.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
      }
      if (blocks.length === 0) {
        return [{ heading: "", body: src }];
      }
      return blocks;
    };

    const markdownBlocks = parseMarkdown(markdownContent);
    const sectionsHtml =
      markdownBlocks.length > 0
        ? markdownBlocks
            .map((block) => {
              return `
                <section style="margin-bottom: 28px; page-break-inside: avoid;">
                  ${block.heading ? `<h2 style="font-size: 18px; margin: 0 0 10px 0;">${escapeHtml(block.heading)}</h2>` : ""}
                  <p style="white-space: pre-wrap; line-height: 1.7; margin: 0;">${escapeHtml(block.body || "내용이 없습니다.")}</p>
                </section>
              `;
            })
            .join("")
        : sectionDefs
            .map((section) => {
              const body = content[section.key] || "내용이 없습니다.";
              return `
                <section style="margin-bottom: 28px; page-break-inside: avoid;">
                  <h2 style="font-size: 18px; margin: 0 0 10px 0;">${escapeHtml(section.label)}</h2>
                  <p style="white-space: pre-wrap; line-height: 1.7; margin: 0;">${escapeHtml(body)}</p>
                </section>
              `;
            })
            .join("");

    const html = `
      <!doctype html>
      <html lang="ko">
        <head>
          <meta charset="utf-8" />
          <title>Report_${escapeHtml(report.report_id.slice(0, 8))}</title>
          <style>
            body { margin: 0; color: #0f172a; font-family: "Times New Roman", serif; }
            .wrap { max-width: 820px; margin: 0 auto; padding: 40px 32px; }
            .meta { color: #475569; font-size: 12px; margin-top: 8px; }
            .title { margin: 0; font-size: 30px; line-height: 1.35; }
            @media print {
              @page { size: A4; margin: 18mm; }
              .wrap { padding: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <main class="wrap">
            <header style="margin-bottom: 26px; border-bottom: 1px solid #cbd5e1; padding-bottom: 14px;">
              <h1 class="title">${escapeHtml(report.title)}</h1>
              <p class="meta">생성일: ${escapeHtml(new Date(report.created_at).toLocaleString("ko-KR"))}</p>
            </header>
            ${sectionsHtml}
          </main>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () { window.close(); };
            };
          </script>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      alert("PDF 저장 준비에 실패했습니다.");
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const printTarget = iframe.contentWindow;
    if (!printTarget) {
      document.body.removeChild(iframe);
      alert("PDF 저장 준비에 실패했습니다.");
      return;
    }

    setTimeout(() => {
      printTarget.focus();
      printTarget.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f1f5f9_0%,#ffffff_30%,#eef2ff_100%)] py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 mb-4">
            <p className="text-xs text-indigo-800 font-semibold mb-2">보고서 생성 파이프라인</p>
            <div className="flex flex-wrap gap-2">
              {phaseOrder.map((phase, idx) => {
                const label = phaseLabelMap[phase] || phase;
                const isCurrent = idx === currentPhaseIndex;
                const isDone = idx < currentPhaseIndex;
                return (
                  <span
                    key={phase}
                    className={`text-xs rounded-full px-2.5 py-1 border ${
                      isCurrent
                        ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                        : isDone
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {isDone ? "✓ " : isCurrent ? "▶ " : ""}
                    {label}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-indigo-700 mt-2">
              현재: <span className="font-semibold">{currentPhaseLabel}</span>
              {progressMeta?.message ? ` · ${progressMeta.message}` : ""}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-lg font-black tracking-tight inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              보고서 데이터를 불러오는 중
            </p>
            <p className="text-sm text-slate-600 mt-2">
              생성 중에는 페이지를 나가도 작업은 계속 진행됩니다. 기록 페이지에서 다시 들어와 확인할 수 있어요.
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => router.push("/my-reports")}>
              기록 페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (!report) return <div className="p-10 text-center">보고서를 찾을 수 없습니다.</div>;

  const parseMarkdownBlocks = (value: string): MarkdownBlock[] => {
    const src = value.replace(/\r\n/g, "\n").trim();
    if (!src) return [];
    const lines = src.split("\n");
    const blocks: MarkdownBlock[] = [];
    let currentHeading = "";
    let currentBody: string[] = [];
    for (const raw of lines) {
      const line = raw.trimEnd();
      const match = line.match(/^#{1,3}\s+(.+)$/);
      if (match) {
        if (currentHeading || currentBody.join("").trim()) {
          blocks.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
        }
        currentHeading = match[1].trim();
        currentBody = [];
        continue;
      }
      currentBody.push(line);
    }
    if (currentHeading || currentBody.join("").trim()) {
      blocks.push({ heading: currentHeading, body: currentBody.join("\n").trim() });
    }
    if (blocks.length === 0) {
      return [{ heading: "", body: src }];
    }
    return blocks;
  };

  const markdownBlocks = parseMarkdownBlocks(markdownContent);
  const hasMarkdown = markdownContent.trim().length > 0;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f1f5f9_0%,#ffffff_30%,#eef2ff_100%)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">보고서 상세</h1>
              <p className="text-sm text-slate-600 mt-1">상태: {report.status}</p>
              {isGenerating && progressMeta?.phase && (
                <p className="text-xs text-indigo-700 mt-1">
                  실시간 단계: {progressMeta.phase}
                </p>
              )}
            </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => router.push("/my-reports")}>목록</Button>
            <Button variant="outline" onClick={onToggleBookmark}>
              {report.is_bookmarked ? <BookmarkCheck className="w-4 h-4 mr-1" /> : <Bookmark className="w-4 h-4 mr-1" />}
              {report.is_bookmarked ? "북마크 해제" : "북마크"}
            </Button>
            <Button variant="outline" onClick={() => setEditMode((prev) => !prev)} disabled={isGenerating}>
              {editMode ? "보기 모드" : "편집 모드"}
            </Button>
            <Button variant="outline" onClick={onDownloadPdf} disabled={isGenerating || saving}>
              <Download className="w-4 h-4 mr-2" />
              PDF 저장
            </Button>
            <Button onClick={onSave} disabled={saving || isGenerating || !editMode} className="bg-slate-900 hover:bg-slate-950">
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}저장
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div className="relative w-full" style={{ perspective: "1000px" }}>
            <div className="absolute inset-0 bg-blue-100/60 rounded-3xl blur-3xl -z-10 scale-105" />

            <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-slate-400 font-medium ml-2">Report_{report.report_id.slice(0, 8)}.pdf</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                  <Download className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="p-8 md:p-12 min-h-[760px] font-serif text-slate-800 bg-white relative overflow-hidden">
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="text-center border-b pb-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{report.title}</h2>
                    <p className="text-slate-500 italic text-xs mt-2">Advanced Subject Exploration Report</p>
                    <div className="flex justify-center gap-4 mt-5 text-xs text-slate-600 font-sans font-medium">
                      <span>생성일: {new Date(report.created_at).toLocaleString("ko-KR")}</span>
                      <span className="text-slate-300">|</span>
                      <span>LangGraph: {String(pipeline?.langgraph_enabled ?? "-")}</span>
                    </div>
                  </div>

                  {isGenerating ? (
                    <>
                      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 mb-4">
                        <p className="text-xs text-indigo-800 font-semibold mb-2">보고서 생성 파이프라인</p>
                        <div className="flex flex-wrap gap-2">
                          {phaseOrder.map((phase, idx) => {
                            const label = phaseLabelMap[phase] || phase;
                            const isCurrent = idx === currentPhaseIndex;
                            const isDone = idx < currentPhaseIndex;
                            return (
                              <span
                                key={phase}
                                className={`text-xs rounded-full px-2.5 py-1 border ${
                                  isCurrent
                                    ? "bg-indigo-600 text-white border-indigo-600 font-bold"
                                    : isDone
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-white text-slate-600 border-slate-200"
                                }`}
                              >
                                {isDone ? "✓ " : isCurrent ? "▶ " : ""}
                                {label}
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-xs text-indigo-700 mt-2">
                          현재: <span className="font-semibold">{currentPhaseLabel}</span>
                          {progressMeta?.message ? ` · ${progressMeta.message}` : ""}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-lg font-black tracking-tight inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                          LangGraph 보고서 생성 중
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                          교과서 RAG, 계획, 생성, 비평, 재작성 단계를 순차 실행하고 있습니다.
                        </p>
                        <ul className="mt-3 text-sm text-slate-700 space-y-1">
                          <li>• 현재 단계: {currentPhaseLabel}</li>
                          <li>• 페이지를 나가도 생성 작업은 계속 진행됩니다.</li>
                          <li>• 기록 페이지에서 다시 들어와 이어서 확인할 수 있습니다.</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                    {recoveryInfo && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 mb-6">
                        <p className="font-semibold mb-1">복구 초안</p>
                        <p>
                          자동 생성이 정상 완료되지 않아 복구 초안이 저장되었습니다.
                          {recoveryInfo.failedPhase ? ` 실패 단계: ${recoveryInfo.failedPhase}.` : ""}
                        </p>
                        {recoveryInfo.error ? <p className="mt-2 break-words">에러: {recoveryInfo.error}</p> : null}
                      </div>
                    )}
                    {report.status === "failed" && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
                        <p className="font-semibold mb-1">생성 실패</p>
                        <p>{failureInfo}</p>
                      </div>
                    )}
                    <div className="space-y-8 text-sm md:text-[15px] leading-relaxed text-justify">
                      {hasMarkdown ? (
                        editMode ? (
                          <textarea
                            className="w-full min-h-[620px] border border-slate-200 rounded-lg p-4 bg-slate-50 font-mono text-sm"
                            value={markdownContent}
                            onChange={(e) => setMarkdownContent(e.target.value)}
                          />
                        ) : (
                          markdownBlocks.map((block, idx) => (
                            <section key={`${block.heading}-${idx}`}>
                              {block.heading ? (
                                <h3
                                  className={`text-base md:text-lg font-bold border-l-4 pl-3 mb-3 ${
                                    idx % 2 === 0 ? "text-slate-800 border-slate-800" : "text-blue-700 border-blue-600"
                                  }`}
                                >
                                  {block.heading}
                                </h3>
                              ) : null}
                              <p className="text-slate-700 whitespace-pre-wrap">{block.body || "내용이 없습니다."}</p>
                            </section>
                          ))
                        )
                      ) : (
                        sectionDefs.map((section, idx) => (
                          <section key={section.key}>
                            <h3 className={`text-base md:text-lg font-bold border-l-4 pl-3 mb-3 ${idx % 2 === 0 ? "text-slate-800 border-slate-800" : "text-blue-700 border-blue-600"}`}>
                              {section.label}
                            </h3>
                            {editMode ? (
                              <textarea
                                className="w-full min-h-40 border border-slate-200 rounded-lg p-4 bg-slate-50 font-sans text-sm"
                                value={content[section.key] ?? ""}
                                onChange={(e) => setContent((prev) => ({ ...prev, [section.key]: e.target.value }))}
                              />
                            ) : (
                              <p className="text-slate-700 whitespace-pre-wrap">{content[section.key] || "내용이 없습니다."}</p>
                            )}
                          </section>
                        ))
                      )}
                    </div>
                    </>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-slate-200/70 shadow-sm h-[420px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><MessageSquareText className="w-4 h-4" /> AI 대화</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 flex-1 min-h-0">
                <div className="border rounded-xl p-3 flex-1 overflow-y-auto space-y-2 bg-slate-50">
                  {chatMessages.length === 0 && <p className="text-sm text-slate-500">문장 개선, 근거 보강, 논리 점검을 요청해보세요.</p>}
                  {chatMessages.map((m, idx) => (
                    <div key={`${m.role}-${idx}`} className={`text-sm p-2 rounded-lg ${m.role === "user" ? "bg-amber-100" : "bg-white"}`}>
                      <p className="font-medium mb-1">{m.role === "user" ? "나" : "AI"}</p>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  ))}
                  {chatLoading && <p className="text-sm text-slate-500">AI 응답 생성 중...</p>}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="예: 분석 섹션을 더 엄밀하게 고쳐줘"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onChatSend();
                    }}
                  />
                  <Button onClick={onChatSend} disabled={chatLoading || isGenerating}>전송</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
