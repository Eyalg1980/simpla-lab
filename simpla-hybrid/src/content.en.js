
  /* ================= media ================= */
  var HF = "https://d2ol7oe51mr4n9.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/";
  var HF2 = "https://d8j0ntlcm91z4.cloudfront.net/user_348jNuehm4zmcU1si73jLXDcXDZ/";
  var W = "https://simpla-clay.higgsfield.app/assets/work/";
  // one still per chapter of the clay take: lump, camera, phone, nodes, class, city, sphere
  var FR = ["d396ae11-d1d7-47cc-b720-8a9cd79aa75c", "3e04283c-ba96-4511-a1ef-63d29f7a94b0", "fa714d3d-fafb-4ca7-aa49-51945e830f08",
    "1239b154-f44f-41fc-ab16-f06d599875d1", "78a471b0-0c9e-41d8-b695-e442d7384a90", "37cbe2e7-0dd0-48e8-b7e3-0da175d9fae6",
    "85e5717d-67b8-41a7-9bfd-41a6d14b11de"].map(function (id) { return HF + id + ".jpg"; });
  var FILM = {
    // one continuous 30s take per aspect, keyframe every 4 frames so scrubbing stays smooth
    wide: HF + "404425f7-3224-4767-8e51-a1a4725c17e7.mp4",
    tall: HF + "7ada9d0a-e524-4256-9076-97ecc6d8fd3c.mp4",
    posterTall: HF + "d2640eea-1431-4367-8fc1-2fbfe8519e90.jpg",
    cutsWide: [4.1, 10.8, 14.9, 18.0, 21.2, 26.7, 30.0],
    cutsTall: [4.6, 9.4, 15.5, 19.6, 23.6, 27.4, 30.0],
    weights: [1.2, 1.9, 1.7, 1.7, 1.7, 1.8, 1.6],
    rail: ["Idea", "Films", "Products", "Systems", "Teams", "Organizations", "Object"]
  };
  // the night TV: one 4:3 reel with a 4s cut per channel, and the clay TV it plays inside
  var REEL = {
    src: HF + "0656125a-7d63-4c25-a6d3-c476c785ff0e.mp4",
    tv: HF + "670097f7-9370-434d-9298-ba4c5417a1c7.jpg",
    starts: [0, 3, 7, 11, 15, 19, 23],
    cuts: [3, 7, 11, 15, 19, 23, 27],
    stills: ["68442d0f-eb27-4cdf-ac40-f5169ff4669d", "d207f108-fa34-4f50-aef3-9c5e84f466b1", "a92b97dd-95cc-41b1-8dd5-ce2a3de87432",
      "556a7214-b5ea-4552-82eb-016ad1948689", "0e964e39-b00d-42c5-9b4e-bfadd522fb93", "e699a5d5-a266-44ca-a210-c590309390d2",
      "63a6d016-9d22-43c4-bf19-0863ce08d9c6"].map(function (id) { return HF + id + ".jpg"; }),
    glow: ["#F7636B", "#E8913A", "#8FB8FF", "#E040FB", "#F2C27A", "#3FD3C2", "#9ED8E6"]
  };

  /* ================= content ================= */
  // ch = chapter of the film and node on the canvas, reel = cut on the TV
  var SOL = {
    studio: { tag: "STUDIO", icon: "video", ch: 1, reel: 1, title: "AI films", name: "Simpla Studio", label: "Films",
      one: "Films built like products.",
      text: "Brand films, ads, product explainers, social series and contest films. From script and storyboard to edit and sound.",
      gets: ["Script and storyboard", "Brand film", "Product explainer", "Mascot", "Social cut-downs"],
      who: "Marketing teams, startups before launch, and brands that need a lot of video without a heavy production." },
    spec: { tag: "SPEC", icon: "image", ch: 2, reel: 2, title: "UX and product spec", name: "Simpla Spec", label: "Spec",
      one: "A product document developers can build from.",
      text: "User research, flows, wireframes and a prototype in Figma. Nine years of leading UX and product at TipRanks behind it.",
      gets: ["PRD", "Flow maps", "Wireframes", "Prototype", "User research"],
      who: "Startups before an MVP, product teams that need one more head, and organizations building an internal tool." },
    flows: { tag: "FLOWS", icon: "flow", ch: 3, reel: 3, title: "Figma Weave and automation", name: "Simpla Flows", label: "Workflows",
      one: "A system that makes consistent content, not a single file.",
      text: "Figma Weave adoption: prompt templates, a LoRA trained on your brand language, and workflows and apps your team runs in one click. Plus automations and internal tools.",
      gets: ["Weave workflows", "Brand LoRA", "Design Apps", "Prompt library", "Documentation"],
      who: "Marketing and content teams, agencies, and anyone who makes a lot of visuals and wants them to look the same every time." },
    lab: { tag: "LAB", icon: "users", ch: 4, reel: 4, title: "Team workshops", name: "Simpla Lab", label: "Training",
      one: "Three hours, one working output per person.",
      text: "A workshop, an intensive day or a series of sessions. For designers, marketers, editors and managers, with a prompt kit ready to use.",
      gets: ["Hands-on workshop", "Intensive day", "Session series", "Prompt kit", "Exercises"],
      who: "Marketing, design, L&D and HR teams. Teams that are already experimenting and want to do it right." },
    adopt: { tag: "ADOPT", icon: "city", ch: 5, reel: 5, title: "AI adoption in organizations", name: "Simpla Adopt", label: "Adoption",
      one: "AI your people actually use.",
      text: "Diagnosis, an opportunity map, tool selection, working rules, a pilot and measurement. Including local authorities and the public sector.",
      gets: ["Diagnosis", "Opportunity map", "Tool selection", "Usage policy", "Pilot", "Measurement"],
      who: "Organizations, local authorities and public bodies that got a mandate from the top and need a practical way in." },
    guide: { tag: "GUIDE", reel: 6, extra: true, title: "Consulting and mentoring", name: "Simpla Guide", short: "Monthly guidance",
      one: "An experienced partner by your side, an hour a week or whenever you need it." },
    academy: { tag: "ACADEMY", reel: 4, extra: true, title: "Study programs", name: "Simpla Academy", short: "Study program",
      one: "Syllabus, lesson plans and lecturer training." }
  };
  var CORE = ["studio", "spec", "flows", "lab", "adopt"];
  var ALL = CORE.concat(["guide", "academy"]);
  var NODES = [{ id: "in", kind: "input" }].concat(CORE.map(function (id) { return { id: id, kind: "sol" }; })).concat([{ id: "out", kind: "output" }]);

  var AUDIENCES = [
    { id: "startup", chip: "Startup", name: "From launch to film", problem: "We have a product, or an idea for one, and no time to waste on guesswork. We need to understand what to build and show it to the world.",
      mods: ["spec", "studio", "flows"], outcome: "An MVP spec, a launch film, a mascot and a basic content system in Figma Weave.", first: "A diagnosis call, then an MVP spec within a few weeks." },
    { id: "marketing", chip: "Marketing team", name: "Content factory", problem: "The team needs more visuals, faster, without losing the brand along the way.",
      mods: ["flows", "lab", "guide"], outcome: "A Figma Weave content pipeline built on your brand, a team workshop, and monthly guidance until it runs on its own.", first: "Map the content you make today, and pick the first type that becomes a system." },
    { id: "agency", chip: "Agency or studio", name: "AI-native agency", problem: "Clients are already asking about AI, and the team is learning on the job.",
      mods: ["lab", "flows", "guide"], outcome: "An advanced Figma Weave and Higgsfield workshop, a shared workflow library, and guidance through the first project.", first: "A workshop for the creative team on a real client brief." },
    { id: "public", chip: "Municipality or public sector", name: "A city that explains itself", problem: "There's a mandate from the top, and staff who don't yet know where to start.",
      mods: ["adopt", "studio", "spec", "lab"], outcome: "An adoption plan, explainer films for residents, a spec for a digital service, and workshops for staff.", first: "A short diagnosis with management and two teams, and a written opportunity map." },
    { id: "edu", chip: "Education institution", name: "Creative AI program", problem: "The students already use AI. The program doesn't, yet.",
      mods: ["academy", "lab"], outcome: "A syllabus ready to run, lecturer training, and workshops for students.", first: "A meeting with the program coordinators, and one course picked for a pilot." }
  ];
  var DEFAULT_PROMPT = "We have an idea, a team or a stuck process. We're not sure where to start.";

  var TOUR = [
    { img: "{{WEAVE_IMG}}wf-canvas.webp", tab: "Canvas", file: "product-shoot.weave", title: "A workflow on the canvas",
      text: "A prompt and a product image feed three nodes, and each one returns a different variation. The bottle and the logo stay exactly as they are, while the model moves between places and poses." },
    { img: "{{WEAVE_IMG}}wf-lora.webp", tab: "LoRA", file: "brand-language.weave", title: "Plugging in a trained model",
      text: "A prompt template and a LoRA of the brand language go into the image model together. Nobody explains the language each time, it's already built in." },
    { img: "{{WEAVE_IMG}}wf-screens.webp", tab: "Series", file: "app-screens.weave", title: "Scaling up to outputs",
      text: "The same LoRA with a different prompt for each screen: a whole series of app screens, all in one visual language." },
    { img: "{{WEAVE_IMG}}wf-app.webp", tab: "Design App", file: "product-shoot.app", title: "An app for the team",
      text: "The team sees only the input fields, swaps an image or a prompt, and gets a result in one click. Even someone who has never opened Weave can run it." }
  ];
  var PIPE = [
    ["Mapping", "Which assets the team makes again and again, and where AI saves the most."],
    ["Visual brainstorming", "From the brand's assets to a catalog of motifs, textures and colors."],
    ["Prompt templates and crafting", "A precise visual language, built side by side with the design team."],
    ["Model training", "Training a LoRA on the language we built together."],
    ["Workflows and apps", "A fixed process for every recurring task, and a simple interface for the team."],
    ["Training and handover", "The team learns to build and maintain it on its own, with no outside dependency."]
  ];
  var WV_GETS = [
    "An organized, documented workflow library for every task that repeats",
    "A LoRA or style system that has learned your brand language",
    "Prompt templates for every type of asset, with variables",
    "Design App tools that even people who never touched Weave can run",
    "A character sheet for your brand character or presenter",
    "Training for the team, so it keeps building and maintaining on its own"
  ];

  var WORKS = [
    { id: "savior", nodes: ["studio"], kind: "Film", title: "Savior Syndrome", sub: "A film for the Higgsfield film festival", len: "3:16", src: HF + "5056b375-f0d0-446e-bed9-bbfa21314504.mp4", preview: HF + "2e34e853-6cd5-4ddd-bd03-74b3b0c5e87e.mp4", poster: HF + "4d8b91e4-2d4a-4c3d-8f73-15b6a5d7215a.jpg", text: "A short film about the need to be the one who saves everyone. Written, directed and edited in-house for the Higgsfield film festival.", gets: ["Script", "Direction", "Character consistency", "Edit and sound"] },
    { id: "wolt", nodes: ["studio"], kind: "Spot", title: "The City That Stopped", sub: "A spec spot for Wolt, for the Higgsfield and ADWEEK Adathon", len: "1:00", src: HF + "ad33e834-3c7c-4d93-b707-eabf7a6dc344.mp4", preview: HF + "bf99884f-039d-4461-a77a-729665ea7c11.mp4", poster: HF + "c3e02351-94b7-4279-a5d5-26ccb244a80d.jpg", text: "A whole clay city has frozen, and one courier on a scooter paints it back to life, street by street, until he knocks on the right door. A spec spot in clay, not commissioned by Wolt.", gets: ["Concept and script", "Clay world", "15 shots", "Voiceover and sound"] },
    { id: "instructions", nodes: ["studio"], kind: "Film", title: "The Instructions", sub: "Short film", len: "4:01", src: HF + "4159fe62-25df-4f2e-9017-7b08e492e7f6.mp4", preview: HF + "5205d1e0-f3b5-4f16-a6eb-4b2e0e9a8bf2.mp4", poster: HF + "393d0e8e-577f-41f2-a79a-729c93e4fe56.jpg", text: "An 82-year-old man assembles a flat-pack piece of furniture on his own, and the digital voice reading him the instructions starts adding things that aren't in the manual.", gets: ["Script", "Direction", "One character across the whole film", "Voiceover and sound"] },
    { id: "tipranks", nodes: ["spec"], kind: "Product", client: "TipRanks", title: "Website home page", loop: true, src: W + "tipranks.mp4", preview: W + "tipranks.mp4", poster: W + "tipranks-poster.jpg", text: "Turning a huge amount of financial data into an experience that is friendly, on-brand and clear at a glance.", gets: ["Ideation", "Wireframes", "Concept design", "UX research", "MVP approach"] },
    { id: "juganu", nodes: ["spec","adopt"], kind: "Product", client: "Juganu", title: "Smart city dashboard", loop: true, src: W + "juganu.mp4", preview: W + "juganu.mp4", poster: W + "juganu-poster.jpg", text: "A system that lets municipalities see what is happening in the city around the clock, and use it to improve residents' lives.", gets: ["Product research", "Prototype", "UX research", "UI and UX design", "Style guide"] },
    { id: "night", nodes: ["studio"], kind: "Film", title: "Night Broadcast", sub: "End of Broadcast: a montage of all our films", len: "1:51", src: HF + "43db6f2b-0b62-4cde-bf8c-76dd27f6d68b.mp4", preview: HF + "021c4623-13fd-4b8f-919a-3fd841a1322b.mp4", poster: HF + "594c3ea7-650b-4f9e-bb90-293de8d0a907.jpg", text: "Someone is channel-surfing at 2am. Every channel is a shard of one of our films, and every character in it is trying to be understood.", gets: ["Concept", "Montage", "Edit", "Sound"] },
    { id: "whofor", nodes: ["studio","flows"], kind: "Film", title: "Who Is It For?", sub: "An anthology from our daily engine", len: "2:53", src: HF + "b1b4150d-d826-4789-bd3c-c12357b868f2.mp4", preview: HF + "ffc80726-b6ff-49fd-bee3-e333874b144c.mp4", poster: HF + "31744d12-2f0e-4477-84ac-1a44bbde17f2.jpg", text: "Worlds of clay and neon born in our daily film engine, and cut together into one film.", gets: ["Daily engine", "Workflows", "World and characters", "Edit"] },
    { id: "burger", nodes: ["studio"], kind: "Series", title: "The Hamburger Menu", sub: "Biography of an Object, episode 1", len: "1:00", shape: "v", src: HF + "948e857c-c826-478d-8f5e-c9a6e71e3748.mp4", preview: HF + "19b426d0-72b0-4d5b-8ab8-6eab47abf955.mp4", poster: HF + "a0171652-f00b-4ba8-bb88-2510cc9f6433.jpg", text: "The first episode of a series that tells the life stories of everyday objects. Vertical, for social.", gets: ["Series", "Vertical format", "Visual world"] },
    { id: "undo", nodes: ["studio"], kind: "Series", title: "Undo", sub: "Biography of an Object, episode 2", len: "1:03", shape: "v", src: HF + "f1e27d1a-e2f1-4845-87b3-631bb5ec03f0.mp4", preview: HF + "b07a8153-1f81-49d5-b3fe-2313f10f4809.mp4", poster: HF + "459a3cf6-f74c-4445-9f2b-92d4bafa71c7.jpg", text: "In December 1976 two IBM researchers wrote a single sentence about being able to take a command back. A minute in clay about the button that was built to calm us down.", gets: ["Series", "Vertical format", "Historical research"] },
    { id: "magnifier", nodes: ["studio"], kind: "Series", title: "The Magnifying Glass", sub: "Biography of an Object, episode 3", len: "0:40", shape: "v", src: HF + "53e43201-9175-4088-bc8c-847f04513ffe.mp4", preview: HF + "117e6c54-72c3-4d99-952f-f9aa707d9871.mp4", poster: HF + "522e5361-9e89-4e09-a3ef-57bcf28e7222.jpg", text: "In 1987 NeXT picked a magnifying glass for the search icon, because searching is looking for a needle in a haystack. The icon has survived four decades, and the box beneath it is slowly disappearing.", gets: ["Series", "Vertical format", "Historical research"] },
    { id: "darkmode", nodes: ["studio"], kind: "Series", title: "Dark Mode", sub: "Biography of an Object, episode 5", len: "0:59", shape: "v", src: HF + "79bf80b7-7750-4d1a-8e12-378a4255322c.mp4", preview: HF + "17832f35-4a63-4de6-b8e5-80b89aba6953.mp4", poster: HF + "e99eaefb-c320-4fda-9188-4e165e3f5828.jpg", text: "The screen was born dark. In 1973 Xerox turned it white, and between 2016 and 2019 we all brought the black back. 59 seconds in clay.", gets: ["Series", "Vertical format", "Historical research"] },
    { id: "frame", nodes: ["studio"], kind: "Series", title: "The Frame", sub: "Biography of an Object, episode 6", len: "1:06", shape: "s", src: HF + "a960e971-3998-4480-a93d-76350b26344e.mp4", preview: HF + "40c0cbd1-fc41-4c84-8863-ca49432f98ac.mp4", poster: HF + "9a682b61-8caa-4cac-b102-be6a9e86a492.jpg", text: "Another episode in the series of object biographies. Square, for the feed.", gets: ["Series", "Square format", "Sound"] },
    { id: "tease", nodes: ["spec"], kind: "Product", client: "Tease", title: "UX inspiration kit", loop: true, src: W + "tease.mp4", preview: W + "tease.mp4", poster: W + "tease-poster.jpg", text: "Showing the UX process behind finished products in a clear and engaging way, for self-guided learning.", gets: ["Ideation", "UX research", "Design", "Animation", "HTML5 canvas", "Storytelling"] },
    { id: "future", nodes: ["studio","lab"], kind: "Film", title: "The Future of Learning", sub: "Short film", len: "1:00", src: HF + "d5cef077-7d70-4f33-8af3-3c0e441e24b8.mp4", preview: HF + "90a8dfc7-731f-4d15-947c-ee2d6da4e0af.mp4", poster: HF + "5a33bc46-4b7d-4f72-b3c2-7e5fa7d47c0f.jpg", text: "A short film about a classroom where knowledge becomes something you can hold in your hand.", gets: ["Script", "Direction", "AI production"] },
    { id: "abstract", nodes: ["flows"], kind: "Site film", title: "From Abstract to Object", sub: "This site's film, in one take", len: "0:30", src: HF2 + "hf_20261016_180938_5d71d29f-22e3-485e-95d9-b3e4f1e827ba.mp4", preview: HF + "518c25f6-7b80-4483-93bb-0e43f2fc0154.mp4", poster: FR[6], text: "Thirty seconds of clay in a single take. At the top of the page, scrolling runs it forward and back.", gets: ["One take", "Keyframes", "Scroll video"] },
    { id: "toolkit", nodes: ["flows"], kind: "Site film", title: "The Toolkit", sub: "A site film in one take", len: "0:25", src: HF2 + "hf_20261016_133904_4d891e10-0a24-4425-9774-ddecfdb03021.mp4", preview: HF + "37cb15dc-34a7-416a-bd5d-6f2939979813.mp4", poster: HF + "5aaab9d4-184b-4e1a-be46-0cbd77ae3393.jpg", text: "A one-take site film, built so that scrolling drives it.", gets: ["One take", "Scroll video"] },
    { id: "paper", nodes: ["flows"], kind: "Site film", title: "Simpla in Paper", sub: "A site film in one take", len: "0:25", src: HF2 + "hf_20261016_090903_1c9acbc6-5ddc-4157-968c-12e20ea7061d.mp4", preview: HF + "f70d21ea-3855-415e-8181-e60e50009c17.mp4", poster: HF + "475904ce-4564-49ec-90aa-14afa3a5f4c8.jpg", text: "A one-take site film, in a world made of paper.", gets: ["One take", "Scroll video"] }
  ];

  /* ================= interface strings ================= */
  var T = {
    lang: "en",
    mailHello: "Hello,\nWe built a flow on your site, and this is what we need:\n",
    mailAbout: "\n\nA bit about us:\n",
    mailSubjectRoute: "A flow from your site",
    mailSubjectBroadcast: "Our broadcast",
    routeAria: function (n) { return "Your flow, " + n + (n === 1 ? " node" : " nodes"); },
    chapter: "Chapter ",
    node: "Node ",
    channel: "Channel ",
    addToRoute: "Add to your flow",
    inYourRoute: "In your flow",
    inRoute: "In your flow",
    inRouteRemove: "In your flow. Tap to remove",
    watch: "Watch: ",
    inputTitle: "Your input",
    inputOne: "Tell us above where you're coming from, and the flow marks itself.",
    outputTitle: "The object",
    outputOne: "What stays with you: a team that runs it all on its own.",
    detailsSuffix: ", details",
    details: "Details",
    works: "Work",
    toAir: "On air",
    changeInput: "Change input",
    yourRoute: "Your flow",
    emptyRoute: "No nodes yet. Tap \u201cAdd to your flow\u201d on a node, or tell us above where you're coming from.",
    remove: "Remove: ",
    extras: "Add-ons for any flow:",
    sendUs: "Send it to us",
    clear: "Clear",
    inspInput: "Every project starts with one sentence: what you have, and what's stuck. Tell us where you're coming from, and the flow is marked on the canvas.",
    inspOutput: "The same material that came in as an idea leaves as a film, a product, a system and a team that runs it all on its own. What you picked goes on air at the end of the page, one channel per node.",
    noNodes: "No nodes picked yet",
    toWeave: "Go to Figma Weave",
    all: "All",
    tvWatch: function (t) { return "Watch work from the " + t + " channel, with sound"; },
    zapAria: "Zap to the next channel",
    zap: "Zap",
    endSlot: "End of broadcast: Night Broadcast",
    leadBuilt: function (n) {
      return (n === 1 ? "You built one channel." : "You built " + n + " channels.") +
        " Every node you picked is on air here. Zap with the remote, and tap the screen to watch the work with sound.";
    },
    leadEmpty: ["You haven't built a flow yet, so tonight every channel is on air. ", "Build a flow on the canvas", ", and the broadcast switches to yours."],
    menu: [["#film", "The film", "FILM"], ["#canvas", "Your flow", "FLOW"], ["#weave", "Figma Weave", "WEAVE"], ["#work", "Work", "WORK"],
      ["#clients", "Clients", "CLIENTS"], ["#teaching", "Teaching", "TEACHING"], ["#about", "About", "ABOUT"], ["#onair", "On air", "ON AIR"], ["#contact", "Contact", "CONTACT"]]
  };
