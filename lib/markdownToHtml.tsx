const markdownToHtml = (markdown) => {
  if (!markdown) return "";

  return (
    markdown
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-semibold text-white mt-6 mb-3">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-bold text-white mt-8 mb-4">$1</h2>'
      )
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-2xl font-bold text-white mt-8 mb-6">$1</h1>'
      )

      // Code blocks
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<div class="bg-[#1A1E1A] border border-[#2A2E2A] rounded-lg p-4 my-4 overflow-x-auto"><pre class="text-sm text-gray-300"><code class="language-$1">$2</code></pre></div>'
      )

      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-[#1A1E1A] text-[#BCDD19] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
      )

      // Bold text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-white">$1</strong>'
      )

      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')

      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#BCDD19] hover:text-[#A2C00C] underline transition-colors">$1</a>'
      )

      // Unordered lists
      .replace(
        /^- (.*$)/gm,
        '<li class="text-gray-300 ml-4 mb-1 list-disc list-inside">$1</li>'
      )

      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4 leading-relaxed">')
      .replace(/\n/g, "<br>")

      // Wrap in paragraph tags
      .replace(
        /^(?!<[h1-6]|<div|<ul|<li)(.+)$/gm,
        '<p class="text-gray-300 mb-4 leading-relaxed">$1</p>'
      )

      // Clean up any empty paragraphs
      .replace(/<p class="[^"]*"><\/p>/g, "")
  );
};

export default markdownToHtml;
