'use client';

import {
  Code,
  CodeBlock,
  CodeHeader,
} from '@/components/animate-ui/components/animate/code';

export const CodeDemo = ({
  duration,
  delay,
  writing,
  cursor,
}) => {
  return (
    <Code
      key={`${duration}-${delay}-${writing}-${cursor}`}
      className="w-full sm:w-110 h-120 border-none"
      code={`from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)

    for word in words:
        key = tuple(sorted(word))
        groups[key].append(word)

    return list(groups.values())


print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))

# Time: O(n * k log k)
# Space: O(n * k)`}
    >
      <CodeHeader
        copyButton
        className="border-white/10 bg-[#2a2a2a]/95 text-zinc-300"
      >
        group_anagrams.py   
      </CodeHeader>

      <CodeBlock
        cursor={cursor}
        lang="python"
        theme="dark"
        className="!bg-transparent [&_pre]:!bg-transparent [&_pre]:![background:transparent] [&_code]:!bg-transparent [&_code]:![background:transparent]"
        writing={writing}
        duration={duration}
        delay={delay}
      />
    </Code>
  );
};