import re
src=open('zwergenladen-umbau.html').read()
tpl=open('paper-template.html').read()
svgcss=src[src.index('/* SVG */'):src.index('</style>')]
script=src[src.index('<script>')+8:src.index('</script>')]
i=src.index('<svg viewBox="0 0 420 250"'); krone=src[i:src.index('</svg>',i)+6]
out=tpl.replace('{{SVGCSS}}',svgcss).replace('{{SCRIPT}}',script).replace('{{KRONE}}',krone)
open('zwergenwald-paper.html','w').write(out)
