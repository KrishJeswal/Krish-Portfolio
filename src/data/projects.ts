/**
 * The four projects, and the seven-part case study for each, as data.
 *
 * Prose is plain text with two inline markers, rendered by <RichText>:
 *   `code`  → mono, --ink
 *   *em*    → <em>
 * Anything typographic (— · ⊕ → ×) is a literal character, as in the design.
 */

export const PROJECT_SLUGS = ["ciphertrace", "lorerecall", "glyphmark", "pathfindr"] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}

/* ---------- architecture diagrams (native markup, not images) ---------- */

/** A small plate. First line is --ink, the rest --ink2. */
export type DiagramNode = {
  readonly lines: readonly string[];
  /** Key nodes in the flow take an accent border. */
  readonly accent?: true;
  /**
   * Somewhere data comes to rest — a database, a registry, a path on disk.
   * Drawn as a pill so stores read differently from the steps between them.
   */
  readonly store?: true;
};

export type DiagramItem =
  | ({ readonly kind: "node" } & DiagramNode)
  /** Hairline connector. Dashed reads as "derived from", accent as "the result". */
  | {
      readonly kind: "link";
      readonly label?: string;
      readonly dashed?: true;
      readonly accent?: true;
    }
  /** Parallel branches. A single column is a stack of alternatives. */
  | { readonly kind: "row"; readonly columns: 1 | 2 | 3; readonly nodes: readonly DiagramNode[] }
  /** A labelled sub-frame — one pipeline inside the whole. */
  | { readonly kind: "group"; readonly label: string; readonly items: readonly DiagramItem[] };

/* ---------- prose blocks ---------- */

export type Block =
  | { readonly kind: "lead"; readonly text: string }
  | { readonly kind: "body"; readonly text: string }
  | {
      readonly kind: "meta";
      readonly items: readonly { readonly label: string; readonly value: string }[];
    }
  | { readonly kind: "metric"; readonly value: string; readonly caption: string }
  | { readonly kind: "formula"; readonly text: string }
  | { readonly kind: "note"; readonly label: string; readonly text: string }
  | {
      readonly kind: "table";
      readonly head: readonly [string, string, string];
      readonly rows: readonly (readonly [string, string, string])[];
    }
  | { readonly kind: "diagram"; readonly items: readonly DiagramItem[] };

/* ---------- sections ---------- */

export const CASE_SECTIONS = [
  { id: "top", number: null, label: "Overview" },
  { id: "capture", number: "01", label: "Capture" },
  { id: "interference", number: "02", label: "Interference" },
  { id: "topology", number: "03", label: "Topology" },
  { id: "hard", number: "04", label: "The hard part" },
  { id: "residual", number: "05", label: "Residual" },
] as const;

export type CaseSectionId = (typeof CASE_SECTIONS)[number]["id"];

/** The five written sections, in order — `top` and `next` are structural. */
export type WrittenSectionId = Exclude<CaseSectionId, "top">;

export type Project = {
  readonly slug: ProjectSlug;
  readonly name: string;
  /** One line, used on the deck card and under the case-study title. */
  readonly subtitle: string;
  readonly domain: string;
  readonly year: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly repo: string;
  readonly sections: Readonly<Record<WrittenSectionId, readonly Block[]>>;
};

/* ============================================================
   01 — CipherTrace
   ============================================================ */

const ciphertrace: Project = {
  slug: "ciphertrace",
  name: "CipherTrace",
  subtitle: "ML Side-Channel Cryptanalysis",
  domain: "ML research",
  year: "2025",
  image: "/assets/ciphertrace.png",
  imageAlt: "CipherTrace attack dashboard",
  repo: "https://github.com/KrishJeswal/CipherTrace",
  sections: {
    capture: [
      { kind: "lead", text: "AES-128 is mathematically sound. The ATMega8515 running it is not." },
      {
        kind: "body",
        text: "Every gate that flips consumes measurably more current than one that doesn’t, so the chip’s power draw carries a shadow of the data it’s handling. CipherTrace is a profiling side-channel attack that trains a classifier on that shadow and recovers the secret key byte — against an implementation specifically hardened to prevent exactly this.",
      },
      {
        kind: "meta",
        items: [
          { label: "Stack", value: "Python, scikit-learn, XGBoost, SHAP, NumPy, h5py, Streamlit" },
          { label: "Target", value: "AES-128 Round-1 S-Box output, ATMega8515" },
          {
            label: "Dataset",
            value: "ASCAD fixed-key (ANSSI) — 50k profiling + 10k attack traces, 700 samples each",
          },
          { label: "Headline", value: "Guessing Entropy 0.46 at 500 traces" },
        ],
      },
    ],
    interference: [
      {
        kind: "body",
        text: "The device is masked. First-order Boolean masking splits every sensitive intermediate `v` into two random shares, `v ⊕ m` and `m`, processed at different moments. Each share is individually uniform, so no single time-sample tells you anything.",
      },
      {
        kind: "metric",
        value: "0.0032",
        caption: "Peak SNR across all 700 samples. Not bad data — the countermeasure doing its job.",
      },
      {
        kind: "body",
        text: "That single fact rules out most of the standard toolkit. Any method that scores samples independently is structurally blind here, because the information only exists in the *combination* of two windows. SNR scores each sample alone. ANOVA does too, and worse, it latches onto mask-processing artifacts.",
      },
      {
        kind: "body",
        text: "The labels fight back as well. Hamming Weight of a uniform byte is Binomial(8, 0.5): class 4 holds ~27% of the data, classes 0 and 8 under 0.5% each. Plain accuracy is meaningless under that skew.",
      },
      {
        kind: "body",
        text: "And underneath all of it, a question I didn’t expect to be the actual project: what does “the model is good” even mean when the goal isn’t classification?",
      },
    ],
    topology: [
      { kind: "lead", text: "Three components, two pipelines, one directional flow." },
      {
        kind: "diagram",
        items: [
          { kind: "node", lines: ["ASCAD.h5 (raw)"] },
          { kind: "link" },
          {
            kind: "node",
            lines: ["generate_ascad.py", "window samples 45400-46100", "split 50k/10k"],
          },
          { kind: "link" },
          { kind: "node", lines: ["ASCAD_processed.h5"] },
          { kind: "link", dashed: true },
          {
            kind: "group",
            label: "01 / Train pipeline",
            items: [
              { kind: "node", lines: ["DataIngestion", "load + Hamming Weight labels"] },
              { kind: "link" },
              { kind: "node", lines: ["DataTransformation", "POITransformer"] },
              { kind: "link" },
              {
                kind: "row",
                columns: 3,
                nodes: [
                  { lines: ["SNR Strategy"] },
                  { lines: ["ANOVA Strategy"] },
                  { lines: ["PCA Strategy"], accent: true },
                ],
              },
              { kind: "link" },
              {
                kind: "node",
                lines: ["ModelTrainer", "6 classifiers, 5-fold StratifiedKFold, f1_macro"],
              },
              { kind: "link" },
              {
                kind: "row",
                columns: 2,
                nodes: [{ lines: ["MLP"], accent: true }, { lines: ["5 Other Classifiers"] }],
              },
            ],
          },
          { kind: "link", label: "writes" },
          {
            kind: "group",
            label: "Artifacts",
            items: [
              {
                kind: "row",
                columns: 1,
                nodes: [
                  { lines: ["artifacts/ingested/", "X_prof.npy"], store: true },
                  { lines: ["artifacts/transformed/", "X_prof_<tag>.npy"], store: true },
                  {
                    lines: ["artifacts/models/", "<model>_<tag>.joblib", "transformer_<tag>.joblib"],
                    store: true,
                  },
                ],
              },
            ],
          },
          { kind: "link", label: "loads" },
          {
            kind: "group",
            label: "02 / Predict pipeline",
            items: [
              { kind: "node", lines: ["PredictPipeline", "load model + transformer"] },
              { kind: "link" },
              { kind: "node", lines: ["predict_proba"] },
              { kind: "link" },
              {
                kind: "node",
                lines: ["compute_ge", "256 key hypotheses", "log-likelihood accumulation"],
                accent: true,
              },
              { kind: "link" },
              { kind: "node", lines: ["GE 0.46 / NtD"], accent: true },
            ],
          },
          { kind: "link", accent: true },
          {
            kind: "row",
            columns: 2,
            nodes: [{ lines: ["Streamlit app"] }, { lines: ["notebooks"] }],
          },
        ],
      },
      {
        kind: "body",
        text: "`DataIngestion` loads the windowed HDF5 and turns plaintexts into labels — the label function *is* the leakage model in code: `pt[2] ⊕ 0xe0` → S-Box → popcount. `DataTransformation` wraps `POITransformer`, which implements all three feature strategies behind the sklearn fit/transform contract, selected by one string. `ModelTrainer` runs six classifiers through 5-fold StratifiedKFold scored on Macro F1.",
      },
      {
        kind: "body",
        text: "That sklearn contract is what makes the research question tractable. Six classifiers × three POI strategies × four values of k is 72 configurations. Each config dataclass derives its own artifact paths from a `{strategy}_k{k}` tag, so flipping one parameter reroutes every output and all 72 runs coexist without collision.",
      },
      {
        kind: "body",
        text: "Everything fitted gets joblib-dumped — transformer, scaler, PCA basis, model. The predict pipeline and the Streamlit app load the exact objects that were trained. No re-fitting, no train/serve skew.",
      },
    ],
    hard: [
      {
        kind: "lead",
        text: "I built the whole grid to find the best classifier. The result was that “best classifier” is a question with two answers that disagree.",
      },
      {
        kind: "body",
        text: "The Decision Tree posted the highest Macro F1 in the sweep (0.1094) and one of the worst attack results (GE 148.86 — barely better than guessing). The MLP had middling F1 and the best attack by a wide margin (GE 16.36). Classification quality and attack success are decoupled.",
      },
      {
        kind: "body",
        text: "The reason is calibration. Guessing Entropy accumulates log-likelihood across traces:",
      },
      { kind: "formula", text: "score(k) = Σᵢ log( P[ HW(SBox[ptᵢ ⊕ k]) ] + ε )" },
      {
        kind: "body",
        text: "Summing logs rewards well-calibrated soft probabilities and punishes overconfident ones, and the punishment compounds exponentially with trace count. A tree leaf that says 1.0 and is wrong contributes a catastrophic term. An MLP’s sigmoid output that says 0.4 and is wrong barely moves the needle. Argmax accuracy cannot see this difference at all.",
      },
      {
        kind: "note",
        label: "ANOVA is actively harmful",
        text: "It pushes GE *above* the random baseline of 127. It selects mask-correlated samples instead of key-correlated ones, so it doesn’t fail to help — it points the attack away from the signal. I kept it in the grid as a negative control.",
      },
      {
        kind: "note",
        label: "PCA wins because it can combine",
        text: "It builds linear combinations across all 700 samples, which can fold the `v ⊕ m` window and the `m` window into a single component. The MLP then exploits that combination non-linearly. SHAP on the PCA+MLP model confirms it’s using distributed regions that SNR never selects.",
      },
      {
        kind: "note",
        label: "The label model decides everything",
        text: "Swapping 9-class Hamming Weight for 256-class Identity labels drops GE from 12.03 to 0.46 at 500 traces. HW is the field-standard default and it’s the wrong one — it throws away discriminability to buy tractability I didn’t need.",
      },
    ],
    residual: [
      {
        kind: "table",
        head: ["Configuration", "Macro F1", "GE @ 500"],
        rows: [
          ["Decision Tree (best F1)", "0.1094", "148.86"],
          ["MLP + PCA (best attack)", "middling", "16.36"],
          ["MLP + PCA, Identity labels", "—", "0.46"],
        ],
      },
      {
        kind: "body",
        text: "GE below 5 counts as a practical break in the literature. 0.46 means the correct key is essentially always ranked first.",
      },
      {
        kind: "note",
        label: "What this isn’t",
        text: "One byte, one key, one device. Full AES-128 recovery means running the pipeline sixteen times, and nothing here tests portability across devices. First-order masking only — higher-order or shuffling countermeasures would need explicitly multivariate models. The classical-ML scope is deliberate but it does leave performance on the table: the best published ASCAD attacks use CNNs on raw traces and reach far lower NtD.",
      },
      {
        kind: "body",
        text: "`compute_ge` is also honestly slow. It’s a pure-Python triple loop — 256 hypotheses × 100 experiments × several trace counts — and it dominates runtime badly enough that I dropped SVM from some grid cells.",
      },
      {
        kind: "note",
        label: "Next",
        text: "Vectorize GE with a precomputed HW table, add a CNN baseline to quantify the classical-vs-deep gap, make the Identity model selectable in the app rather than just referenced.",
      },
    ],
  },
};

/* ============================================================
   02 — LoreRecall
   ============================================================ */

const lorerecall: Project = {
  slug: "lorerecall",
  name: "LoreRecall",
  subtitle: "Agentic Second Brain",
  domain: "ML · RAG",
  year: "2025",
  image: "/assets/lorerecall-v2.png",
  imageAlt: "LoreRecall pipeline interface",
  repo: "https://github.com/KrishJeswal/LoreRecall",
  sections: {
    capture: [
      { kind: "lead", text: "Point it at a Notion database and it reads everything you meant to read." },
      {
        kind: "body",
        text: "LoreRecall pulls every page, follows the links inside them, crawls the linked articles, throws out the junk, fine-tunes a small model on what’s left, and indexes everything for hybrid search. Then an agent answers questions against it. About 100 Notion pages becomes roughly 600 documents. Every part of it runs on a free tier or on my laptop, including the fine-tuned model.",
      },
      {
        kind: "meta",
        items: [
          {
            label: "Stack",
            value: "Python 3.12, ZenML, crawl4ai, MongoDB Atlas, LangChain, smolagents, Unsloth, Gradio, Opik",
          },
          { label: "Corpus", value: "~100 Notion pages → ~600 crawled documents" },
          {
            label: "Models",
            value: "Gemini 2.5 Flash (teacher), Groq Llama 3.3 70B (agent), fine-tuned Llama 3.2 3B (local)",
          },
          { label: "Constraint", value: "Free tier or own hardware, end to end" },
        ],
      },
    ],
    interference: [
      {
        kind: "body",
        text: "My Notion is a graveyard of saved links. I bookmark something, write two lines about why it looked interesting, and never open it again. Search doesn’t help, because I can’t remember which words I used.",
      },
      {
        kind: "body",
        text: "The obvious build — index the Notion pages — produces something useless. My notes are pointers. The knowledge is in the linked article. Index only the note and you get an assistant that can confidently tell you that you bookmarked something about PDF parsing, and nothing whatsoever about PDF parsing.",
      },
      {
        kind: "body",
        text: "So the crawl is mandatory, which drags in two problems. Half the web that matters here is client-rendered documentation, so a plain HTTP fetch returns an empty shell. And crawling indiscriminately fills the corpus with cookie banners, 404 bodies, and link farms.",
      },
      {
        kind: "metric",
        value: "512",
        caption: "MB on MongoDB Atlas M0 — a real ceiling on embedding dimensionality, not a soft target.",
      },
      {
        kind: "body",
        text: "Then the budget. Free tier, end to end. My GPU is 6 GB, which is a real ceiling on what “local model” can mean. Neither is negotiable: they either fit or the project doesn’t exist.",
      },
    ],
    topology: [
      { kind: "lead", text: "Feature, training, inference — split on cadence rather than taste." },
      {
        kind: "diagram",
        items: [
          { kind: "node", lines: ["Notion workspace"] },
          { kind: "link" },
          {
            kind: "group",
            label: "01 / Offline — feature + training (ZenML)",
            items: [
              { kind: "node", lines: ["P1 collect", "Notion blocks to Documents + child URLs"] },
              { kind: "link" },
              {
                kind: "node",
                lines: ["P2 etl", "crawl4ai headless browser, 2-tier quality score, load to Mongo"],
              },
              { kind: "link" },
              { kind: "node", lines: ["P3 dataset", "generate summaries, build instruct pairs"] },
              { kind: "link" },
              {
                kind: "node",
                lines: ["P4 train", "QLoRA on Kaggle T4, export GGUF Q4_K_M, serve via Ollama"],
              },
              { kind: "link" },
              {
                kind: "node",
                lines: ["P5 index", "chunk, contextualise, embed bge-small 384d, index"],
                accent: true,
              },
            ],
          },
          { kind: "link", label: "batch 20 min crawl" },
          {
            kind: "node",
            lines: ["MongoDB Atlas M0", "Vector Search + BM25"],
            accent: true,
            store: true,
          },
          { kind: "link", label: "monthly fine-tune", dashed: true },
          { kind: "node", lines: ["Ollama model registry"], store: true },
          { kind: "link", label: "2 s query" },
          {
            kind: "group",
            label: "02 / Online — inference",
            items: [
              { kind: "node", lines: ["Gradio UI"] },
              { kind: "link" },
              { kind: "node", lines: ["smolagents ToolCallingAgent"], accent: true },
              { kind: "link" },
              {
                kind: "row",
                columns: 3,
                nodes: [
                  { lines: ["what_can_i_do", "capability discovery"] },
                  { lines: ["search_second_brain", "hybrid retrieval, RRF fusion"], accent: true },
                  { lines: ["summarize_text", "fine-tuned Llama 3.2 3B, local"] },
                ],
              },
              { kind: "link", dashed: true },
              { kind: "node", lines: ["Opik", "traces, datasets, LLM-as-judge"] },
            ],
          },
        ],
      },
      {
        kind: "body",
        text: "Indexing is a batch job. Fine-tuning happens once a month at most. Answering a question takes two seconds. Cram all three into one process and your web server needs a GPU.",
      },
      {
        kind: "body",
        text: "So they’re separate apps that only talk through MongoDB and the model registry. Offline runs five ZenML pipelines: collect Notion blocks and extract child URLs, crawl and quality-score into Mongo, generate a summarization dataset, QLoRA fine-tune on a Kaggle T4 and export to GGUF, then chunk / contextualise / embed / index. Online is a smolagents ToolCallingAgent with three tools — capability discovery, hybrid retrieval over Atlas Vector Search and BM25 fused with RRF, and summarization through the local fine-tuned 3B.",
      },
      {
        kind: "body",
        text: "ZenML’s step caching isn’t decoration here. The crawl takes twenty minutes and I rewrote the quality-scoring prompt about six times. Without caching that’s a lost day.",
      },
      {
        kind: "note",
        label: "The duplication is deliberate",
        text: "The two apps share no code on purpose. There are about 150 duplicated lines in the retriever setup and I kept them, because the inference app has to deploy without dragging in the training app’s dependencies. If the duplication grows much past this I’ll extract a third shared package rather than reconnect them.",
      },
      {
        kind: "body",
        text: "Constraints propagate cleanly through the stack choices. `bge-small-en-v1.5` at 384 dimensions is a quarter the size of OpenAI’s embeddings, which is what keeps the whole index inside M0’s 512 MB. Gemini is the teacher because the binding limit on long documents is tokens per minute rather than requests. Groq drives the agent because agent turns are short and it’s fast. LiteLLM sits underneath all of it, so switching provider is a string change.",
      },
    ],
    hard: [
      {
        kind: "lead",
        text: "Fine-tuning a model here isn’t a quality decision. It’s a decision about cost structure.",
      },
      {
        kind: "body",
        text: "Contextual retrieval needs one LLM call per chunk — a sentence situating that chunk inside its parent document. That’s thousands of calls every time I rebuild the index. On any API that’s either expensive or rate-limited into uselessness, and the practical consequence isn’t the bill. It’s that you stop experimenting with chunk size, because every experiment costs money. The constraint silently removes a knob from the project.",
      },
      { kind: "body", text: "Running it locally made rebuilds free, so I actually tried things." },
      {
        kind: "note",
        label: "Why 3B and not 8B",
        text: "At Q4_K_M a 3B is about 2 GB, fitting entirely in VRAM with room left for the KV cache. An 8B spills to CPU and generates three to five times slower. So I gave up some quality on one narrow, repetitive task to get a model that runs on hardware I own — which is the actual argument for small specialised models, as opposed to just asserting that small specialised models are good.",
      },
      {
        kind: "body",
        text: "The crawl needed its own answer. crawl4ai drives a headless browser, so client-rendered docs sites return real content instead of an empty shell, and a two-tier quality score runs over everything that comes back to drop the cookie banners and 404 bodies before they ever reach the index. Garbage in the corpus doesn’t announce itself at query time — it just quietly makes retrieval worse, which is why the scoring pass exists upstream of embedding rather than as a filter after it.",
      },
    ],
    residual: [
      {
        kind: "lead",
        text: "The thing I’d defend hardest isn’t the pipeline. It’s that there’s an evaluation harness at all.",
      },
      {
        kind: "body",
        text: "Three retrieval strategies get compared on the same hand-labelled query set — hybrid search over plain chunks, parent-document retrieval, and contextual retrieval plus hybrid — scored on whether a correct chunk lands in the top 3. Each one carries a different cost: the first two make zero LLM calls, the third makes one per chunk. So the comparison isn’t “which retrieves best,” it’s “what does the expensive one actually buy,” which is the only version of the question that changes a decision.",
      },
      {
        kind: "body",
        text: "The agent gets its own pass: a custom heuristic metric for summary density, plus LLM-as-judge on answer quality, both run through Opik with step-level traces. Tracing matters more than it sounds — when an agent picks its own tools, a bad answer has three or four possible origins, and without traces you’re guessing which one failed.",
      },
      {
        kind: "note",
        label: "Where it’s weak",
        text: "The dataset isn’t group-split properly, so the evaluation numbers are softer than they look and I know it. The corpus goes stale — ingestion is a full rebuild rather than incremental, with nothing scheduled. And the Notion integration only sees pages explicitly shared with it, which returns an empty list that looks exactly like an empty database. That one cost me an hour.",
      },
      {
        kind: "note",
        label: "Next",
        text: "Cross-encoder reranking over the top 20 hybrid results, query rewriting before retrieval, and incremental ingestion keyed on `last_edited_time` so the rebuild stops being all-or-nothing.",
      },
    ],
  },
};

/* ============================================================
   03 — GlyphMark
   ============================================================ */

const glyphmark: Project = {
  slug: "glyphmark",
  name: "GlyphMark",
  subtitle: "Multi-Surface MCP Toolchain",
  domain: "Systems · TypeScript",
  year: "2025",
  image: "/assets/glyphmark-v3.png",
  imageAlt: "GlyphMark toolchain",
  repo: "https://github.com/KrishJeswal/GlyphMark",
  sections: {
    capture: [
      { kind: "lead", text: "Write the capability once; expose it through every door an agent might reach for." },
      {
        kind: "body",
        text: "GlyphMark writes a capability once in a shared core package, then exposes it through a terminal CLI, a local stdio MCP server, a remote HTTP MCP server behind OAuth, and a Skill that tells agents which one to pick. The shipped operation sends a Telegram message and is deliberately trivial. The project is the wiring, not the payload.",
      },
      {
        kind: "meta",
        items: [
          { label: "Stack", value: "TypeScript 6 (strict), Bun, Zod 4, MCP SDK, Commander, Hono, Clerk, tsdown" },
          { label: "Shape", value: "Monorepo — 1 core package, 3 adapters, 1 Skill" },
          { label: "Published", value: "Three packages on npm; the remote app stays private" },
          { label: "Surfaces", value: "CLI, stdio MCP, remote HTTP MCP, Skill" },
        ],
      },
    ],
    interference: [
      {
        kind: "body",
        text: "An agent reaching for a capability might come through any of four doors, and each door has a different owner. A human at a terminal configures a machine once. An MCP client spawns a process and controls what it inherits. A hosted server is multi-tenant and gets a new caller every request. A Skill isn’t code at all — it’s routing guidance an agent reads before choosing.",
      },
      {
        kind: "body",
        text: "Implement the capability separately behind each of those and it drifts. The CLI validates one way, the MCP tool another, and eventually they disagree about what a valid input is.",
      },
      {
        kind: "note",
        label: "The sharper problem is credentials",
        text: "Every surface needs the same bot token, but “where does the token come from” has a different correct answer per surface. And on the MCP surfaces there’s a security wrinkle that doesn’t exist on the CLI: anything you put in a tool’s input schema is something the model can be persuaded to fill in, log, or hand back.",
      },
    ],
    topology: [
      {
        kind: "lead",
        text: "Core imports nothing from any adapter. Every adapter does the same three things and nothing more.",
      },
      {
        kind: "diagram",
        items: [
          {
            kind: "group",
            label: "01 / Core — @krish-dev/glyphmark-core",
            items: [
              {
                kind: "row",
                columns: 1,
                nodes: [
                  { lines: ["telegramMessageOptionsSchema", "{chatId, message, botToken}"] },
                  {
                    lines: ["telegramMessageInputSchema", "{chatId, message}", "— no credential"],
                    accent: true,
                  },
                  {
                    lines: [
                      "imports no adapter code",
                      "no Commander, no MCP SDK,",
                      "no console, no process.exit",
                    ],
                  },
                ],
              },
              { kind: "link" },
              { kind: "node", lines: ["sendTelegramMessage()"], accent: true },
              { kind: "link" },
              { kind: "node", lines: ["Telegram Bot API"] },
            ],
          },
          { kind: "link", label: "credentials arrive out of band", dashed: true },
          {
            kind: "group",
            label: "02 / Adapters",
            items: [
              {
                kind: "row",
                columns: 2,
                nodes: [
                  {
                    lines: [
                      "packages/cli",
                      "Commander, bin: glyphmark",
                      "~/.config/glyphmark/config.json (0600)",
                    ],
                  },
                  {
                    lines: [
                      "packages/local-mcp",
                      "stdio MCP, bin: glyphmark-mcp",
                      "TELEGRAM_BOT_TOKEN in server env",
                    ],
                  },
                  {
                    lines: [
                      "apps/remote-mcp",
                      "Hono + Clerk OAuth, HTTP MCP",
                      "bot token in URL path, per request",
                    ],
                    accent: true,
                  },
                  { lines: ["skills/glyphmark", "SKILL.md", "no credentials, no logic"] },
                ],
              },
              { kind: "link" },
              {
                kind: "row",
                columns: 2,
                nodes: [
                  { lines: ["Clerk OAuth bearer", "— who is calling"], accent: true },
                  { lines: ["bot token in path", "— which bot"], accent: true },
                ],
              },
              { kind: "link" },
              { kind: "node", lines: ["fresh McpServer per request", "closed in finally"] },
            ],
          },
          { kind: "link", label: "connects to core", accent: true },
        ],
      },
      {
        kind: "body",
        text: "`packages/core` exports schemas and operations. No Commander, no MCP SDK, no console, no `process.exit`. It takes validated input, does the work, returns validated output, and reports failure by throwing — leaving each adapter to decide how to surface that. The CLI prints to stderr and sets an exit code; the MCP servers turn the same throw into a tool error.",
      },
      {
        kind: "body",
        text: "The Zod schemas are layered so each adapter validates exactly what it accepts. `telegramMessageInputSchema` is `{ chatId, message }` — no credential. `telegramMessageOptionsSchema` is that plus `botToken`. Every exported type is inferred from a schema rather than hand-written, so there’s one source of truth per shape and no chance of a type and a validator disagreeing.",
      },
      {
        kind: "body",
        text: "Registration is deliberately explicit: each adapter names the operations it exposes rather than pulling from a shared registry. That’s more boilerplate, and it’s the thing that keeps the adapter boundaries visible.",
      },
    ],
    hard: [
      {
        kind: "lead",
        text: "A credential in a tool schema is a credential a model can be talked into leaking.",
      },
      {
        kind: "body",
        text: "So the MCP tool exposes `{ chatId, message }` and nothing else. The bot token arrives out of band — from `TELEGRAM_BOT_TOKEN` in the server environment — and if it’s missing, the tool throws with a message pointing back at the client config rather than asking the model to supply one. The model never sees the credential, so no amount of prompt injection can make it hand one over.",
      },
      {
        kind: "body",
        text: "The remote server is where this gets interesting, because two independent credentials meet at every request. A Clerk OAuth bearer token in the Authorization header answers *who is calling*. A URL-encoded bot token in the path segment answers *which bot to send as*. They’re verified separately and neither substitutes for the other.",
      },
      {
        kind: "note",
        label: "Statelessness falls out of it",
        text: "Each request builds a fresh McpServer bound to that request’s bot token, connects it over a streamable HTTP transport in stateless JSON mode, and closes it in a finally block once the response is out. Nothing is shared between requests, so multi-tenancy falls out of the request lifecycle instead of needing a session store.",
      },
      {
        kind: "note",
        label: "The 401 is load-bearing",
        text: "A missing or invalid bearer token returns 401 with a `WWW-Authenticate: Bearer resource_metadata=\"…\"` header pointing at the protected-resource metadata route. That isn’t decoration — it’s the exact handshake MCP OAuth clients follow to discover the login flow, so getting the header shape right is the difference between a client that can self-register and one that just fails.",
      },
      {
        kind: "body",
        text: "The remaining sharp edge is that the URL contains a live token. It has to be treated as a secret, and the README says so in bold, but it’s a real trade I made for per-request tenancy rather than a solved problem.",
      },
    ],
    residual: [
      {
        kind: "body",
        text: "Three packages published to npm (core, glyphmark, glyphmark-mcp), one private remote app, one Skill installable via `npx skills add`. Publishing core first is a hard ordering constraint — the CLI and local MCP depend on it through `workspace:*`, which resolves to a concrete version at publish time.",
      },
      {
        kind: "note",
        label: "No test suite",
        text: "Deliberate, not an oversight: the adapters are thin enough that verification is running format, lint, typecheck, the three builds, and then exercising each surface by hand. It’s honest for a repo this size and it’s the first thing I’d change if a second operation landed, because the “adding your own operation” checklist is eight steps across five files and that’s exactly the kind of thing that rots silently.",
      },
      {
        kind: "note",
        label: "One operation",
        text: "The pattern claims to scale to many; it has been tested with one. The explicit-registration choice specifically bets that the boilerplate won’t hurt until there are enough operations that it does — which is a bet I haven’t collected on yet.",
      },
      {
        kind: "body",
        text: "There’s no hosted endpoint, so anyone wanting the remote surface deploys their own copy with their own Clerk app.",
      },
    ],
  },
};

/* ============================================================
   04 — Pathfindr
   ============================================================ */

const pathfindr: Project = {
  slug: "pathfindr",
  name: "Pathfindr",
  subtitle: "Graph-Based Indoor Navigation",
  domain: "Product · React",
  year: "2025",
  image: "/assets/pathfindr.png",
  imageAlt: "Pathfindr interface",
  repo: "https://github.com/KrishJeswal/Pathfindr",
  sections: {
    capture: [
      { kind: "lead", text: "Pick a start and an end room; it traces the shortest walk through the building." },
      {
        kind: "body",
        text: "Click the rooms on the floor plan or use the dropdowns, and Pathfindr animates the route through the ETE block at RVCE, switching floors through the lift when it has to. Four floors, hand-built graph, A* underneath.",
      },
      {
        kind: "meta",
        items: [
          { label: "Stack", value: "React 19, Vite, Tailwind 4, Vitest, Firebase Hosting" },
          { label: "Scope", value: "Four floors of the ETE block, RVCE" },
          { label: "Context", value: "Smart Indoor Navigation & Faculty Monitoring System" },
          { label: "Companion", value: "Faculty Spatial Tracker — real-time availability over Firebase" },
        ],
      },
    ],
    interference: [
      {
        kind: "body",
        text: "GPS is useless indoors, and the building has no machine-readable representation of itself. There’s no OSM data for the ETE block, no BIM export, no floor-plan API. Whatever graph the search runs over, someone has to build it by hand from architectural drawings.",
      },
      {
        kind: "note",
        label: "Where the naive approach breaks",
        text: "If you treat the lift as just another edge weighted by geometric distance, vertical travel becomes almost free — the shortest path will happily ride the lift up a floor and back down to save a few metres of corridor. That’s optimal by the metric and absurd to a person actually walking it.",
      },
      {
        kind: "body",
        text: "The last constraint was one we set ourselves: this had to run entirely client-side and stay static-hostable. No routing server, no backend, no per-request cost.",
      },
    ],
    topology: [
      { kind: "lead", text: "Pure geometry and graph search, with React kept on the other side of the boundary." },
      {
        kind: "diagram",
        items: [
          {
            kind: "group",
            label: "01 / Input (App.jsx)",
            items: [
              {
                kind: "row",
                columns: 3,
                nodes: [
                  { lines: ["Sidebar dropdowns"] },
                  { lines: ["Click room on SVG plan"] },
                  { lines: ["Floor switcher"] },
                ],
              },
              { kind: "link" },
              { kind: "node", lines: ["origin + destination"] },
            ],
          },
          { kind: "link" },
          {
            kind: "group",
            label: "02 / Graph model (navigation.js)",
            items: [
              {
                kind: "row",
                columns: 3,
                nodes: [
                  { lines: ["NODES {x, y, floor}"] },
                  { lines: ["CONNECTIONS edges"] },
                  { lines: ["Cross-floor lift edges", "+ transit penalty"], accent: true },
                ],
              },
              { kind: "link" },
              { kind: "node", lines: ["Edge weights", "Euclidean distance"] },
              { kind: "link" },
              {
                kind: "node",
                lines: ["findShortestPathAStar", "heuristic = distance + floor difference"],
                accent: true,
              },
              { kind: "link" },
              { kind: "node", lines: ["ordered node ID path"] },
            ],
          },
          { kind: "link", label: "renders" },
          {
            kind: "group",
            label: "03 / Render (FloorPlans.jsx)",
            items: [
              { kind: "node", lines: ["SVG geometry", "floors G/1/2/3"] },
              { kind: "link" },
              { kind: "node", lines: ["Animated polyline", "+ location beacons"] },
            ],
          },
          { kind: "link", label: "tests directly", dashed: true },
          { kind: "node", lines: ["navigation.test.js", "Vitest — no React dependency"] },
          { kind: "link" },
          { kind: "node", lines: ["Static build to dist/"] },
          { kind: "link" },
          { kind: "node", lines: ["Firebase Hosting"] },
          { kind: "link" },
          { kind: "node", lines: ["dashboard/ hub"] },
          { kind: "link", label: "Firebase realtime", dashed: true },
          { kind: "node", lines: ["Faculty Spatial Tracker"] },
        ],
      },
      {
        kind: "body",
        text: "The whole model lives in `navigation.js`. Every room and corridor junction is a NODE with `{ x, y, floor }`; CONNECTIONS are the edges between them. Edge weights are Euclidean distance, except cross-floor lift edges, which carry a large additive transit penalty. `findShortestPathAStar` runs A* with a heuristic combining straight-line distance and floor difference, and returns an ordered list of node IDs.",
      },
      {
        kind: "body",
        text: "That separation is what makes the thing testable. `navigation.js` knows nothing about React or SVG, and `navigation.test.js` exercises it directly with Vitest. `FloorPlans.jsx` holds the SVG geometry for each of the four floors. `App.jsx` is the shell: sidebar controls, floor switcher, and the SVG workspace where the returned path renders as a polyline with a flowing energy animation and location beacons.",
      },
      {
        kind: "body",
        text: "Static build to `dist/`, served from Firebase Hosting, with a dashboard hub linking Pathfindr to the companion Faculty Spatial Tracker.",
      },
    ],
    hard: [
      {
        kind: "lead",
        text: "The transit penalty isn’t a tuning knob. It’s a claim about what “shortest” means to a human.",
      },
      {
        kind: "body",
        text: "Pure Euclidean weighting optimizes distance travelled. But a person doesn’t experience a lift ride as distance. They experience waiting, entering, riding, exiting — a fixed cost that dwarfs the few metres of horizontal travel it might save. Adding a large constant to every cross-floor edge encodes that: the search now only changes floors when staying put is genuinely worse, which matches how anyone actually navigates a building.",
      },
      {
        kind: "note",
        label: "Admissibility is the catch",
        text: "A* is only guaranteed optimal if the heuristic never overestimates the true remaining cost. Straight-line distance is admissible on its own. Adding a floor-difference term keeps it admissible as long as that term stays at or below the real penalty — overshoot it and the search starts returning wrong paths that look plausible enough that you don’t notice.",
      },
      {
        kind: "body",
        text: "The other real cost is unglamorous: hand-authoring the graph. Every room coordinate, every corridor junction, every edge, typed out and cross-checked against the floor plan. It works and it’s accurate, but it’s the reason this covers one block and not the campus.",
      },
    ],
    residual: [
      {
        kind: "body",
        text: "Working four-floor routing, click-to-select on the plans, animated multi-floor paths, unit-tested graph, deployed and shareable.",
      },
      {
        kind: "note",
        label: "What it doesn’t do",
        text: "No live position — you tell it where you are, it doesn’t know. The graph is hand-authored, so extending to another block is manual work rather than configuration. There’s no accessibility routing: stairs and lift aren’t distinguished by user preference, which matters for anyone who can’t take stairs and is the gap I’d close first. And the companion Faculty Tracker is a separate page, not an input to the router.",
      },
      {
        kind: "note",
        label: "Next",
        text: "Derive the node graph semi-automatically from floor-plan SVGs, add stairs-vs-lift preference as a routing constraint, and route *to a person* rather than a room by feeding tracker availability into destination selection.",
      },
    ],
  },
};

export const projects: readonly Project[] = [ciphertrace, lorerecall, glyphmark, pathfindr];

export function projectBySlug(slug: ProjectSlug): Project {
  const found = projects.find((p) => p.slug === slug);
  // PROJECT_SLUGS is derived from this list, so this cannot miss.
  if (!found) throw new Error(`Unknown project: ${slug}`);
  return found;
}

/** The deck and the case-study footer both cycle 1→2→3→4→1. */
export function nextProject(slug: ProjectSlug): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
