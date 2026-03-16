function initResizers() {
            const rLeft = document.getElementById('resizer-left');
            const pLeft = document.getElementById('panel-left');
            const rRight = document.getElementById('resizer-right');
            const pRight = document.getElementById('panel-right');

            rLeft.addEventListener('mousedown', (e) => {
                let startX = e.clientX; let startWidth = pLeft.getBoundingClientRect().width;
                document.body.style.cursor = 'col-resize'; rLeft.classList.add('dragging');
                const onMove = (evt) => { pLeft.style.width = (startWidth + evt.clientX - startX) + 'px'; };
                const onUp = () => { document.body.style.cursor = 'default'; rLeft.classList.remove('dragging'); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
            });

            rRight.addEventListener('mousedown', (e) => {
                let startX = e.clientX; let startWidth = pRight.getBoundingClientRect().width;
                document.body.style.cursor = 'col-resize'; rRight.classList.add('dragging');
                const onMove = (evt) => { pRight.style.width = (startWidth - (evt.clientX - startX)) + 'px'; };
                const onUp = () => { document.body.style.cursor = 'default'; rRight.classList.remove('dragging'); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
            });
        }
        initResizers();

        const chat = document.getElementById('chat');
        function addUserMsg(t) { chat.innerHTML += `<div class="msg user"><div class="msg-avatar"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="msg-bubble">${t}</div></div>`; chat.scrollTop = chat.scrollHeight; }
        function addBotMsgHTML(html) { chat.innerHTML += `<div class="msg assistant"><div class="msg-avatar"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10-5.5 0-10-4.5-10-10C2 6.5 6.5 2 12 2Z"/></svg></div><div class="msg-bubble">${html}</div></div>`; chat.scrollTop = chat.scrollHeight; }

        async function startAnalysis() {
            document.getElementById('analyze-btn').innerText = "解析を実行中...";
            
            // ユーザーからの指示（チャット吹き出し）を追加
            addUserMsg("この特許PDFドキュメントの基礎解析を実行して、課題と解決手段を抽出してください。");
            
            // リアルなローディング感を出すため少し遅延させる
            setTimeout(() => {
                document.getElementById('analyze-btn').innerText = "解析完了";
                document.getElementById('baseline-result').style.display = 'block';
                
                // Required Text Replacement
                const html = `
                    解析が完了しました！<br>
                    右側の「ナレッジ＆リザルト」パネルに1件の請求項データ（課題と解決手段）を抽出しています。<br><br>
                    さらにTRIZを用いた深掘り分析を行う場合は、右パネル下の「TRIZ分析を開始」ボタンを押してください。
                    <div style="display: flex; gap: 12px; margin-top: 16px; align-items: stretch;">
                        <div style="flex: 1; border: 1px solid var(--border-color); background: #fff; border-radius: 8px; padding: 14px;">
                            <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; margin-bottom: 8px;">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--primary);"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                                抽出された特許データプレビュー
                            </div>
                            <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">請求項1: 従来のシステムでは解析速度が遅く...<br>請求項2: 測定時の様々な環境要因や...</div>
                        </div>
                        
                        <button onclick="openModal()" style="min-width: 90px; border: 2px solid #ef4444; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #dc2626; font-weight: 700; font-size: 15px; transition: 0.2s; background: #fef2f2; cursor: pointer; padding: 12px;">
                            もっと<br>大きく<br>表示
                        </button>
                    </div>
                `;
                addBotMsgHTML(html);

                // Show TRIZ button next to send button
                document.getElementById('btn-triz-inline').style.display = 'flex';
            }, 600);
        }

        function triggerTRIZBubble() {
            // Right panel tab change aesthetic (Optional)
            document.querySelectorAll('.right-tab')[1].classList.add('active');
            document.querySelectorAll('.right-tab')[0].classList.remove('active');
            
            addUserMsg("この情報をもとに、TRIZ分析を開始してください。");
            document.getElementById('btn-triz-inline').style.display = 'none'; // Hide after click
            
            setTimeout(() => {
                // The explicit side-by-side Layout Requested!
                const html = `
                    分かりました。TRIZ分析にかける対象課題をクリックしてください。
                    <div style="display: flex; gap: 12px; margin-top: 16px; align-items: stretch; height: 100%;">
                        <div style="flex: 1; border: 1px solid #fde68a; background: #fffbeb; border-radius: 8px; padding: 14px;">
                            <div style="display: flex; align-items: center; gap: 8px; color: #b45309; font-weight: 600; font-size: 13px; margin-bottom: 8px;">
                                📄 請求項1の課題
                            </div>
                            <div style="font-size: 12px; color: #78350f; line-height: 1.5;">従来のシステムでは解析速度が遅く、精度が低い状態であった。</div>
                        </div>
                        
                        <!-- もっと大きく表示 領域 -->
                        <button onclick="openModal()" style="min-width: 90px; border: 2px solid #ef4444; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #dc2626; font-weight: 700; font-size: 15px; transition: 0.2s; background: #fef2f2; cursor: pointer; padding: 12px;">
                            もっと<br>大きく<br>表示
                        </button>
                    </div>
                `;
                addBotMsgHTML(html);
            }, 500);
        }

        const modal = document.getElementById('notion-modal');
        function openModal() { modal.classList.add('active'); }
        function closeModal() { modal.classList.remove('active'); }

        const resultModal = document.getElementById('notion-result-modal');
        function openResultModal() { resultModal.classList.add('active'); }
        function closeResultModal() { resultModal.classList.remove('active'); }

        async function executeTRIZ() {
            closeModal();
            addUserMsg("この課題をTRIZ40原則を使って深い分析にかけてください。");
            
            const id = 'typ-' + Date.now();
            chat.innerHTML += `<div class="msg assistant" id="${id}"><div class="msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" class="loader-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><div class="msg-bubble">TRIZ推論エンジンを実行中...</div></div>`;
            chat.scrollTop = chat.scrollHeight;

            await new Promise(r => setTimeout(r, 2000));
            document.getElementById(id).remove();

            const html = `
                **TRIZ分析が完了しました。**<br>
                右パネルの「TRIZ分析タブ」に新しい発明原理の技術提案をまとめました。
                <div style="display: flex; gap: 12px; margin-top: 16px; align-items: stretch; height: 100%;">
                    <div style="flex: 1; border: 1px solid #fde68a; background: #fffbeb; border-radius: 8px; padding: 14px;">
                        <div style="display: flex; align-items: center; gap: 8px; color: #b45309; font-weight: 600; font-size: 13px; margin-bottom: 8px;">
                            💡 発明原理10: 先取り作用 など抽出完了
                        </div>
                        <div style="font-size: 12px; color: #78350f; line-height: 1.5;">実行前にキャッシュ層を構築し、よく使われるパターンを予測計算しておく...</div>
                    </div>
                    
                    <button onclick="openResultModal()" style="min-width: 90px; border: 2px solid #ef4444; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #dc2626; font-weight: 700; font-size: 15px; transition: 0.2s; background: #fef2f2; cursor: pointer; padding: 12px;">
                        もっと<br>大きく<br>表示
                    </button>
                </div>
            `;
            addBotMsgHTML(html);
            
            document.getElementById('triz-badge').style.display = 'inline-block';
            document.getElementById('baseline-result').style.display = 'none';
            document.getElementById('triz-result').style.display = 'block';
        }

        document.querySelectorAll('.right-tab').forEach((tab, index) => {
            tab.onclick = () => {
                document.querySelectorAll('.right-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if(index === 0) {
                    document.getElementById('baseline-result').style.display = 'block';
                    document.getElementById('triz-result').style.display = 'none';
                } else {
                    document.getElementById('baseline-result').style.display = 'none';
                    document.getElementById('triz-result').style.display = 'block';
                }
            }
        });