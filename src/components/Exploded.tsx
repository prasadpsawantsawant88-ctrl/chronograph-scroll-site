import { TextChapter } from './TextChapter'
import { annotationTimeline } from './AnnotationLayer'
import { annotations, copy, timeline } from '../config/content'

/** Scene C — exploded view, with annotation lines that draw in one by one. */
export function Exploded() {
  return (
    <TextChapter
      id="exploded"
      {...timeline.exploded}
      {...copy.exploded}
      side="left"
      inAt={0.07}
      outAt={0.9}
      extra={(tl) => annotationTimeline(tl, 0.26, 0.095, 0.9)}
    >
      {/* Shown as a legend on narrow screens, where labels beside the image would not fit. */}
      <ol className="legend">
        {annotations.map((a) => (
          <li key={a.n}><b>{a.n}</b> {a.text}</li>
        ))}
      </ol>
    </TextChapter>
  )
}
