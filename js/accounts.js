// ============================================================
//  accounts.js — 마음 전하실 곳 (계좌 접이식 + 번호 복사)
// ------------------------------------------------------------
//  * 계좌가 하나도 없으면 #accounts 섹션을 숨깁니다.
//  * <details>/<summary> 로 접이식 (JS 토글 불필요).
// ============================================================
import { showToast, copyToClipboard } from "./ui.js?v=202607211848";

function buildAccountRow(acc) {
  const row = document.createElement("div");
  row.className = "account-row";

  const info = document.createElement("div");
  info.className = "account-row__info";
  const holder = document.createElement("p");
  holder.className = "account-row__holder";
  holder.textContent = [acc.relation, acc.holder].filter(Boolean).join(" · ");
  const bank = document.createElement("p");
  bank.className = "account-row__bank";
  bank.textContent = [acc.bank, acc.number].filter(Boolean).join(" ");
  info.append(holder, bank);
  row.appendChild(info);

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "account-row__copy";
  copyBtn.textContent = "복사";
  copyBtn.addEventListener("click", async () => {
    const ok = await copyToClipboard(String(acc.number || "").trim());
    showToast(ok ? "계좌번호가 복사되었어요" : "복사에 실패했어요");
  });
  row.appendChild(copyBtn);

  if (acc.kakaopay) {
    const pay = document.createElement("a");
    pay.className = "account-row__pay";
    pay.href = acc.kakaopay;
    pay.target = "_blank";
    pay.rel = "noopener noreferrer";
    pay.textContent = "송금";
    row.appendChild(pay);
  }
  return row;
}

export function initAccounts(config, root = document) {
  const section = root.querySelector("#accounts");
  const host = root.querySelector("[data-accounts]");
  const a = config?.accounts || {};
  const groups = [
    ["신랑측", a.groom],
    ["신부측", a.bride],
  ].filter(([, list]) => Array.isArray(list) && list.length);

  if (!groups.length) {
    if (section) section.hidden = true;
    return;
  }
  if (!host) return;

  host.textContent = "";
  groups.forEach(([title, list]) => {
    const details = document.createElement("details");
    details.className = "account-group";
    const summary = document.createElement("summary");
    summary.className = "account-group__summary";
    summary.textContent = title;
    details.appendChild(summary);
    list.forEach((acc) => details.appendChild(buildAccountRow(acc)));
    host.appendChild(details);
  });
}
