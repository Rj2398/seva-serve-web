"use client";
import React, { useState, useEffect } from "react";
import { globalServerRequest } from "@/actions/globalApi";

const DEFAULT_CATEGORY_ICON = "/images/home/top-right-plumbing.svg";

const SevaServeAgentPanel = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [conversationId, setConversationId] = useState<string>("");

  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      sender: "agent",
      text: "How can I help you today?",
      type: "text",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<any[]>([]);

  // Inline User Message Editing States
  const [editingMessageId, setEditingMessageId] = useState<any>(null);
  const [editingText, setEditingText] = useState<string>("");

  // 1. INITIAL LOAD: LocalStorage se Conversation ID restored, lekin history fetch nahi hogi
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) return;

    // Restore saved conversation_id if available
    const storedConvId = localStorage.getItem("conversation_id");
    if (storedConvId) {
      setConversationId(storedConvId);
    }

    const fetchInitialData = async () => {
      try {
        const response = await globalServerRequest({
          endpoint: "chatbot/get-category",
          method: "GET",
        });
        if (response.data?.status) {
          const cats = response.data?.data?.categories || [];
          const questions = response.data?.data?.suggested_questions || [];
          setCategories(cats);
          setSuggestedQuestions(questions);
        }
      } catch (error) {
        console.error("Error fetching initial chatbot data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Helper Function: LocalStorage aur State dono mein sync rakhna
  const updateConversationId = (newId: string) => {
    if (newId) {
      setConversationId(newId);
      localStorage.setItem("conversation_id", newId);
    }
  };

  // 2. RESET FUNCTION: Sirf UI State clear hogi, LocalStorage waali conversation_id DELETE NAHI HOGI
  const handleResetChat = () => {
    setSelectedCategory(null);
    setInputValue("");
    setSelectedFiles([]);
    setPreviewFiles([]);
    setEditingMessageId(null);
    setEditingText("");
    setMessages([
      {
        id: Date.now(),
        sender: "agent",
        text: "How can I help you today?",
        type: "text",
      },
    ]);
  };

  const startEdit = (msgId: any, currentText: string) => {
    setEditingMessageId(msgId);
    setEditingText(currentText);
  };

  const saveEdit = (msgId: any) => {
    if (!editingText.trim()) return;

    setMessages((prev: any[]) =>
      prev.map((msg) =>
        msg.id === msgId ? { ...msg, text: editingText } : msg
      )
    );

    setEditingMessageId(null);
    setEditingText("");
  };

  const handleCategorySelect = async (category: any) => {
    setSelectedCategory(category);
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: category.name,
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await globalServerRequest({
        endpoint: "chatbot/chat",
        method: "POST",
        payload: {
          category_id: category.id,
          message: category.name,
          conversation_id: conversationId, // Sends existing conversation_id if available
        },
      });

      if (response.success) {
        const resData = response.data?.data || response.data || {};
        const newConvId =
          resData.conversation_id || resData.data?.conversation_id;

        // Save/Update Conversation ID in LocalStorage
        if (newConvId) updateConversationId(newConvId);

        const botText =
          resData.ai_response ||
          resData.message ||
          `How can I assist you with ${category.name}?`;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "agent",
            text: botText,
            options: resData.options || null,
            type: "text",
          },
        ]);
      }
    } catch (error) {
      console.error("Error starting chatbot conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
    }));
    setPreviewFiles((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (text: string, filesToSend: File[]) => {
    if (!text.trim() && filesToSend.length === 0) return;

    const localPreviews = filesToSend.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      media: localPreviews,
      type: "text",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setSelectedFiles([]);
    setPreviewFiles([]);
    setLoading(true);

    try {
      if (filesToSend.length > 0) {
        const uploadFormData = new FormData();
        filesToSend.forEach((file) => {
          uploadFormData.append("media[]", file);
        });
        if (text.trim()) {
          uploadFormData.append("message", text);
        }

        // STEP 1: Upload Media API
        const uploadRes = await globalServerRequest({
          endpoint: "chatbot/upload-media",
          method: "POST",
          payload: uploadFormData,
          isFormData: true,
        });

        if (uploadRes.success) {
          const uploadData = uploadRes.data?.data || uploadRes.data || {};

          let uploadedUrls: string[] = [];
          if (Array.isArray(uploadData.media)) {
            uploadedUrls = uploadData.media.map((m: any) =>
              typeof m === "string" ? m : m.url || m.path || ""
            );
          } else if (uploadData.url) {
            uploadedUrls = [uploadData.url];
          } else if (uploadData.path) {
            uploadedUrls = [uploadData.path];
          } else if (typeof uploadData === "string") {
            uploadedUrls = [uploadData];
          }

          const validMediaUrls = uploadedUrls.filter(Boolean);

          // STEP 2: Analyze Media API
          const analyzeFormData = new FormData();
          validMediaUrls.forEach((url) => {
            analyzeFormData.append("media[]", url);
          });
          if (text.trim()) {
            analyzeFormData.append("message", text);
          }
          if (selectedCategory?.id) {
            analyzeFormData.append("category_id", selectedCategory.id);
          }
          if (conversationId) {
            analyzeFormData.append("conversation_id", conversationId);
          }

          const analyzeRes = await globalServerRequest({
            endpoint: "chatbot/analyze-media",
            method: "POST",
            payload: analyzeFormData,
            isFormData: true,
          });

          if (analyzeRes.success) {
            const analyzeData = analyzeRes.data?.data || analyzeRes.data || {};

            const firstIssue = analyzeData.analysis?.issues?.[0] || {};

            const catId =
              firstIssue.category_id ||
              analyzeData.category_id ||
              selectedCategory?.id ||
              1;
            const subCatId =
              firstIssue.subcategory_id || analyzeData.subcategory_id || "";
            const serviceId =
              firstIssue.service_id || analyzeData.service_id || "";
            const issueTitle =
              firstIssue.issue || analyzeData.issue || text || "Issue Request";
            const problemDesc =
              firstIssue.problem_description ||
              analyzeData.problem_description ||
              text ||
              "";
            const aiAnalysisMsg =
              firstIssue.ai_analysis ||
              analyzeData.ai_analysis ||
              analyzeData.message ||
              "Analysis complete.";

            const mediaArray = validMediaUrls.length > 0 ? validMediaUrls : [];

            // STEP 3: Create Issue API
            const createIssueRes = await globalServerRequest({
              endpoint: "chatbot/create-issue",
              method: "POST",
              payload: {
                category_id: catId,
                subcategory_id: subCatId,
                service_id: serviceId,
                issue: issueTitle,
                problem_description: problemDesc,
                ai_analysis: aiAnalysisMsg,
                media: mediaArray,
              },
            });

            if (createIssueRes.success) {
              const issueData =
                createIssueRes.data?.data || createIssueRes.data || {};
              const generatedIssueId = issueData.issue_id || issueData.id || "";

              let quoteId = null;

              // STEP 4: Create Quote From Issue API
              if (generatedIssueId) {
                try {
                  const quoteFormData = new FormData();
                  quoteFormData.append("issue_id", generatedIssueId);

                  const res = await globalServerRequest({
                    endpoint: "chatbot/create-quote-from-issue",
                    method: "POST",
                    payload: quoteFormData,
                    isFormData: true,
                  });

                  if (res?.success) {
                    const quoteData = res.data?.data || res.data || {};
                    quoteId = quoteData.quote_id || quoteData.id || null;
                  }
                } catch (quoteErr) {
                  console.error("Error creating quote from issue:", quoteErr);
                }
              }

              const finalIdToPass = quoteId || generatedIssueId;
              const detailUrl = finalIdToPass
                ? `/summary-estimate?requestedId=${finalIdToPass}`
                : "/summary-estimate";

              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + 1,
                  sender: "agent",
                  text: aiAnalysisMsg,
                  isCard: true,
                  link: { text: "View Details", url: detailUrl },
                  type: "text",
                },
              ]);
            } else {
              throw new Error(createIssueRes.error || "Failed to create issue");
            }
          } else {
            throw new Error(analyzeRes.error || "Failed to analyze media");
          }
        } else {
          throw new Error(uploadRes.error || "Failed to upload media");
        }
      } else {
        const response = await globalServerRequest({
          endpoint: "chatbot/chat",
          method: "POST",
          payload: {
            category_id: selectedCategory?.id || "",
            message: text,
            conversation_id: conversationId, // Passes persistent conversation_id
          },
        });

        if (response.success) {
          const resData = response.data?.data || response.data || {};
          const newConvId =
            resData.conversation_id || resData.data?.conversation_id;

          // Save/Update Conversation ID in LocalStorage
          if (newConvId) updateConversationId(newConvId);

          const botText = resData.ai_response || resData.message || "";

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "agent",
              text: botText,
              options: resData.options || null,
              type: "text",
            },
          ]);
        }
      }
    } catch (error: any) {
      console.error("Error processing chat message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "agent",
          text: "Sorry, I couldn't process your request. Please try again.",
          type: "text",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage(inputValue, selectedFiles);
  };

  return (
    <div
      className="offcanvas offcanvas-end agent-off-canvas-wrp"
      tabIndex={-1}
      id="agent-msg-offcanvasRight"
    >
      <div className="messages-inbox-in">
        <div className="offcanvas-header agent-header-tab d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn-close my-cross ms-0"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            >
              <img
                src="/images/off-canvas/cross-icon-off-canvas.svg"
                alt="Close"
              />
            </button>
            <div className="agent-header d-flex align-items-center gap-2">
              <img src="/images/off-canvas/agent-profile-img.svg" alt="Agent" />
              <div className="seve-agt-avl">
                <p className="user-seva-text mb-0">SevaServe Agent</p>
                <p className="available mb-0">
                  <span></span>Available
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleResetChat}
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "12px",
                lineHeight: "1.2",
              }}
              title="Reset Chat"
            >
              Reset
            </button>

            <h5 className="agent-call-icon mb-0">
              <img src="/images/off-canvas/agent-call-icon.svg" alt="Call" />
            </h5>
          </div>
        </div>

        <div className="offcanvas-body agent-body">
          {messages.length <= 1 && (
            <>
              <h2>How can I help you today?</h2>
              <div className="agent-service">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <img
                      src={
                        category.icon ? category.icon : DEFAULT_CATEGORY_ICON
                      }
                      alt={category.name}
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_CATEGORY_ICON;
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px",
                        objectFit: "contain",
                      }}
                    />
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="water-leakage">
                {suggestedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="ineer-srv"
                    onClick={() => handleSendMessage(question, [])}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      <img src="/images/home/service-icon.svg" alt="Service" />
                    </span>
                    <p>{question}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="messages-inbox-grp">
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                {/* USER MESSAGE WRAPPER WITH INLINE EDIT */}
                {msg.sender === "user" && (
                  <div className="right-side-wrp d-flex flex-column align-items-end mb-3">
                    <div className="right-side img-inner">
                      <div className="chat">
                        {editingMessageId === msg.id ? (
                          <div className="d-flex align-items-center gap-2">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              style={{
                                background: "#fff",
                                color: "#000",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-success py-0 px-2"
                              onClick={() => saveEdit(msg.id)}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            {msg.media &&
                              msg.media.map((med: any, idx: number) => {
                                if (med.type?.startsWith("video/")) {
                                  return (
                                    <video
                                      key={idx}
                                      src={med.url}
                                      controls
                                      style={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        display: "block",
                                      }}
                                    />
                                  );
                                }
                                return (
                                  <img
                                    key={idx}
                                    src={med.url}
                                    alt="Uploaded Media"
                                    style={{
                                      maxWidth: "100%",
                                      borderRadius: "8px",
                                      marginBottom: "8px",
                                      display: "block",
                                    }}
                                  />
                                );
                              })}
                            {msg.text}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Edit Pencil Icon for User Messages */}
                    {editingMessageId !== msg.id && msg.text && (
                      <span
                        onClick={() => startEdit(msg.id, msg.text)}
                        style={{ cursor: "pointer", marginTop: "4px" }}
                        title="Edit Message"
                      >
                        <img
                          src="/images/home/msg-edit-icon.svg"
                          alt="edit"
                          style={{ width: "14px", height: "14px" }}
                        />
                      </span>
                    )}
                  </div>
                )}

                {/* AI AGENT MESSAGE WRAPPER WITH LOGO AVATAR ON THE LEFT */}
                {msg.sender === "agent" && (
                  <div
                    className="msg-img-wrper"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      gap: "8px",
                      marginBottom: "16px",
                      width: "100%",
                    }}
                  >
                    {/* AI Logo Avatar - Positioned strictly on the Left */}
                    <div
                      className="ai-agent-picture flex-shrink-0"
                      style={{
                        width: "28px",
                        height: "28px",
                      }}
                    >
                      <img
                        src="/images/off-canvas/agent-profile-img.svg"
                        alt="AI Logo"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          display: "block",
                        }}
                      />
                    </div>

                    <div className="text-btn-inner">
                      <div className="left-side left">
                        {msg.isCard ? (
                          /* View Details Card UI */
                          <div
                            className="chat"
                            style={{
                              backgroundColor: "#F8F9FA",
                              borderRadius: "16px",
                              padding: "16px",
                              maxWidth: "280px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                lineHeight: "1.4",
                                color: "#1a1a1a",
                              }}
                            >
                              {msg.text}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                lineHeight: "1.4",
                                color: "#1a1a1a",
                                fontWeight: "500",
                              }}
                            >
                              Do you want to review all entered details?
                            </p>
                            <a
                              href={msg.link?.url || "#"}
                              className="btn"
                              style={{
                                width: "100%",
                                textAlign: "center",
                                padding: "8px 16px",
                                backgroundColor: "transparent",
                                color: "#1a1a1a",
                                border: "1px solid #1a1a1a",
                                borderRadius: "24px",
                                fontSize: "14px",
                                fontWeight: "500",
                                textDecoration: "none",
                                marginTop: "4px",
                              }}
                            >
                              {msg.link?.text || "View Details"}
                            </a>
                          </div>
                        ) : (
                          /* Standard AI Chat Bubble */
                          <div className="chat">
                            <p className="mb-0">{msg.text}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {loading && (
              <div className="p-2 text-muted" style={{ fontSize: "13px" }}>
                AI Agent is processing...
              </div>
            )}
          </div>
        </div>

        <div className="send-msg-wrp">
          {previewFiles.length > 0 && (
            <div
              className="d-flex gap-2 p-2 mx-3 mb-2"
              style={{ background: "#f8f9fa", borderRadius: "8px" }}
            >
              {previewFiles.map((file, index) => (
                <div key={index} style={{ position: "relative" }}>
                  {file.type?.startsWith("video/") ? (
                    <video
                      src={file.url}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <img
                      src={file.url}
                      alt="preview"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="messages-type-send-in">
              <input
                type="text"
                placeholder="Tell SevaServe your problem"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <label style={{ cursor: "pointer" }}>
                <img src="/images/home/attach-file.svg" alt="Attach File" />
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  hidden
                />
              </label>
              <button type="submit" disabled={loading}>
                <img src="/images/home/msg-send.svg" alt="Send" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SevaServeAgentPanel;
