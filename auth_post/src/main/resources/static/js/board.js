const state = {
  token: localStorage.getItem("authPostToken") || "",
  userId: localStorage.getItem("authPostUserId") || "",
  lastSignup: JSON.parse(localStorage.getItem("authPostLastSignup") || "null")
};

const $ = (selector) => document.querySelector(selector);

const els = {
  tokenDot: $("#tokenDot"),
  tokenText: $("#tokenText"),
  logoutButton: $("#logoutButton"),
  authNotice: $("#authNotice"),
  boardNotice: $("#boardNotice"),
  loginForm: $("#loginPanel"),
  signupForm: $("#signupPanel"),
  fillLoginButton: $("#fillLoginButton"),
  postForm: $("#postForm"),
  lookupButton: $("#lookupButton"),
  sampleButton: $("#sampleButton"),
  clearLogButton: $("#clearLogButton"),
  console: $("#console"),
  userId: $("#userId"),
  lookupId: $("#lookupId"),
  title: $("#title"),
  content: $("#content"),
  previewTitleText: $("#previewTitleText"),
  previewPostId: $("#previewPostId"),
  previewUserId: $("#previewUserId"),
  previewContent: $("#previewContent")
};

function setNotice(element, type, message) {
  element.className = `notice ${type} show`;
  element.textContent = message;
}

function clearNotice(element) {
  element.className = "notice";
  element.textContent = "";
}

function updateTokenView() {
  els.tokenDot.classList.toggle("active", Boolean(state.token));
  els.tokenText.textContent = state.token ? `Bearer ${state.token}` : "토큰 없음";
  if (state.userId) {
    els.userId.value = state.userId;
  }
}

function log(label, payload) {
  const time = new Date().toLocaleTimeString("ko-KR", { hour12: false });
  const body = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  els.console.textContent = `[${time}] ${label}\n${body}\n\n${els.console.textContent}`;
}

async function parseResponse(response) {
  const text = await response.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }
  return data;
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (state.token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${state.token}`);
  }
  const response = await fetch(path, { ...options, headers });
  const data = await parseResponse(response);
  log(`${options.method || "GET"} ${path} ${response.status}`, data || "(empty response)");

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || data?.error || response.statusText;
    throw new Error(message || "요청에 실패했습니다.");
  }
  return { response, data };
}

function renderPreview(post) {
  const title = post?.title || els.title.value || "게시글을 작성하거나 조회해보세요";
  const content = post?.content || els.content.value || "서버 응답이나 입력 중인 내용이 이곳에 표시됩니다.";
  const postId = post?.id ? `post: ${post.id}` : "post: 대기";
  const userId = post?.userId || els.userId.value || "미지정";

  els.previewTitleText.textContent = title;
  els.previewPostId.textContent = postId;
  els.previewUserId.textContent = `user: ${userId}`;
  els.previewContent.textContent = content;
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `${button.dataset.tab}Panel`);
    });
  });
});

els.signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNotice(els.authNotice);

  const form = new FormData(els.signupForm);
  const payload = {
    username: form.get("username"),
    password: form.get("password"),
    email: form.get("email")
  };

  try {
    const { data } = await request("/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    state.userId = String(data.id || "");
    state.lastSignup = payload;
    localStorage.setItem("authPostUserId", state.userId);
    localStorage.setItem("authPostLastSignup", JSON.stringify(payload));
    updateTokenView();
    setNotice(els.authNotice, "success", `회원가입 성공. 사용자 ID ${state.userId || "확인 필요"}가 작성 폼에 반영되었습니다.`);
  } catch (error) {
    setNotice(els.authNotice, "error", error.message);
  }
});

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNotice(els.authNotice);

  const form = new FormData(els.loginForm);
  const body = new URLSearchParams();
  body.set("username", form.get("username"));
  body.set("password", form.get("password"));

  try {
    const { response } = await request("/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    const authHeader = response.headers.get("Authorization") || "";
    state.token = authHeader.replace(/^Bearer\s+/i, "");
    if (!state.token) {
      setNotice(els.authNotice, "warn", "로그인 요청은 성공했지만 Authorization 헤더가 비어 있습니다.");
    } else {
      localStorage.setItem("authPostToken", state.token);
      setNotice(els.authNotice, "success", "로그인 성공. JWT가 브라우저에 저장되었습니다.");
    }
    updateTokenView();
  } catch (error) {
    setNotice(els.authNotice, "error", error.message || "로그인 실패");
  }
});

els.fillLoginButton.addEventListener("click", () => {
  if (!state.lastSignup) {
    setNotice(els.authNotice, "warn", "먼저 회원가입을 완료하면 입력값을 가져올 수 있습니다.");
    return;
  }
  $("#loginUsername").value = state.lastSignup.username || "";
  $("#loginPassword").value = state.lastSignup.password || "";
  setNotice(els.authNotice, "success", "최근 회원가입 정보를 로그인 폼에 채웠습니다.");
});

els.postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearNotice(els.boardNotice);

  const payload = {
    userId: Number(els.userId.value),
    title: els.title.value,
    content: els.content.value
  };

  if (!state.token) {
    setNotice(els.boardNotice, "warn", "게시글 작성은 JWT가 필요합니다. 먼저 로그인하세요.");
    return;
  }

  try {
    const { data } = await request("/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    els.lookupId.value = data.id || "";
    renderPreview(data);
    setNotice(els.boardNotice, "success", `게시글 ${data.id}번이 작성되었습니다.`);
  } catch (error) {
    setNotice(els.boardNotice, "error", error.message);
  }
});

els.lookupButton.addEventListener("click", async () => {
  clearNotice(els.boardNotice);
  const id = els.lookupId.value.trim();
  if (!id) {
    setNotice(els.boardNotice, "warn", "조회할 게시글 ID를 입력하세요.");
    return;
  }

  try {
    const { data } = await request(`/board/${encodeURIComponent(id)}`);
    renderPreview(data);
    setNotice(els.boardNotice, "success", `게시글 ${id}번을 조회했습니다.`);
  } catch (error) {
    setNotice(els.boardNotice, "error", error.message);
  }
});

els.sampleButton.addEventListener("click", () => {
  els.title.value = "보안 테스트 게시글";
  els.content.value = "입력값은 미리보기에서 textContent로 표시됩니다.\n<script>alert('xss')<\\/script>\n서버 저장 및 응답 처리는 백엔드 정책을 확인하세요.";
  renderPreview();
});

els.logoutButton.addEventListener("click", () => {
  state.token = "";
  localStorage.removeItem("authPostToken");
  updateTokenView();
  setNotice(els.authNotice, "success", "저장된 JWT를 초기화했습니다.");
  log("local", "JWT cleared");
});

els.clearLogButton.addEventListener("click", () => {
  els.console.textContent = "ready";
});

[els.title, els.content, els.userId].forEach((element) => {
  element.addEventListener("input", () => renderPreview());
});

updateTokenView();
renderPreview();
