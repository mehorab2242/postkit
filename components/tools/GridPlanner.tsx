"use client";

import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FileDrop } from "@/components/ui/FileDrop";
import { ImageLoadError, thumbnail } from "@/lib/loadImage";

const MAX_TILES = 18;
const STORAGE_KEY = "postkit:grid-planner";

type Tile = { id: string; src: string };

function Sortable({ tile, index }: { tile: Tile; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tile.id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="touch-none"
      {...attributes}
      {...listeners}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.src}
        alt={`Photo ${index + 1} of your grid`}
        className="aspect-3/4 w-full cursor-grab object-cover"
        draggable={false}
      />
    </li>
  );
}

/** This component never server-renders, so reading storage up front is safe. */
function readStoredTiles(): Tile[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    return stored ? (JSON.parse(stored) as Tile[]) : [];
  } catch {
    // A corrupt or unavailable store just means starting empty.
    return [];
  }
}

export default function GridPlanner() {
  const [tiles, setTiles] = useState<Tile[]>(readStoredTiles);
  const [tallCrop, setTallCrop] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Persisting alongside the state change, rather than in an effect, keeps the
   * quota error attached to the action that caused it.
   */
  const persist = useCallback((update: (previous: Tile[]) => Tile[]) => {
    setTiles((previous) => {
      const next = update(previous);

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        queueMicrotask(() =>
          setError(
            "That is more than this browser will save, but you can still arrange the grid now.",
          ),
        );
      }

      return next;
    });
  }, []);

  /* Touch needs its own sensor with an activation delay, or every attempt to
     scroll the page picks up a tile instead. */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  async function handleFiles(files: File[]) {
    setError(null);

    const room = MAX_TILES - tiles.length;

    if (room <= 0) {
      setError(`The grid holds ${MAX_TILES} photos. Remove one to add another.`);
      return;
    }

    const added: Tile[] = [];

    for (const file of files.slice(0, room)) {
      try {
        added.push({
          id: `${file.name}-${crypto.randomUUID()}`,
          src: await thumbnail(file),
        });
      } catch (cause) {
        setError(
          cause instanceof ImageLoadError
            ? cause.message
            : `${file.name} could not be opened, so it was skipped.`,
        );
      }
    }

    persist((previous) => [...added, ...previous]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    persist((previous) => {
      const from = previous.findIndex((tile) => tile.id === active.id);
      const to = previous.findIndex((tile) => tile.id === over.id);

      return arrayMove(previous, from, to);
    });
  }

  return (
    <div className="p-4">
      <FileDrop
        onFiles={handleFiles}
        multiple
        label={tiles.length === 0 ? "Add photos to get started" : "Add more photos"}
        hint={`Up to ${MAX_TILES} photos. Nothing is uploaded — they stay on your device.`}
      />

      {tiles.length > 0 && (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-small text-muted">
              {tiles.length} / {MAX_TILES} photos
            </p>
            <label className="flex min-h-11 items-center gap-2 text-small">
              <input
                type="checkbox"
                checked={tallCrop}
                onChange={(event) => setTallCrop(event.target.checked)}
              />
              Show the tall 3:4 crop
            </label>
          </div>

          <p className="mt-2 text-small text-muted">
            Press and hold a photo, then drag it into place.
          </p>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tiles.map((tile) => tile.id)}
              strategy={rectSortingStrategy}
            >
              <ul
                className={`mt-4 grid grid-cols-3 gap-0.5 ${
                  tallCrop ? "[&_img]:aspect-3/4" : "[&_img]:aspect-square"
                }`}
              >
                {tiles.map((tile, index) => (
                  <Sortable key={tile.id} tile={tile} index={index} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <div className="mt-5 border-t border-rule pt-5">
            <Button variant="secondary" onClick={() => persist(() => [])}>
              Clear all
            </Button>
          </div>
        </>
      )}

      {error && (
        <p role="alert" className="mt-4 border border-mark p-3 text-small">
          {error}
        </p>
      )}
    </div>
  );
}
