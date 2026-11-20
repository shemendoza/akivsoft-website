
"use client";

import { useState } from "react";
import PendingSubmitButton from "@/components/admin/PendingSubmitButton";

import {
  createServiceContentBlock,
  updateServiceContentBlock,
  toggleServiceContentBlockPublished,
  deleteServiceContentBlock,
} from "@/app/akiv-base/admin/services/actions";

import type {
  ServiceContentBlockItem,
  ServiceContentBlockRecord,
} from "@/lib/admin-services";

type Props = {
  sectionId: string;
  sectionName: string;
  block: ServiceContentBlockRecord | null;
};

type FeatureItem = {
  title: string;
  description: string;
};

function emptyFeatureItem(): FeatureItem {
  return { title: "", description: "" };
}

export default function ServiceContentBlockManager({
  sectionId,
  sectionName,
  block,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [blockType, setBlockType] = useState<"list" | "feature">("list");
  const [eyebrow, setEyebrow] = useState("");
  const [heading, setHeading] = useState("");
  const [gradientText, setGradientText] = useState("");
  const [itemsHeading, setItemsHeading] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState<"left" | "right">("left");

  const [listItems, setListItems] = useState<string[]>([]);
  const [featureItems, setFeatureItems] = useState<FeatureItem[]>([]);
  const [newListItem, setNewListItem] = useState("");
  const [newFeatureItem, setNewFeatureItem] =
    useState<FeatureItem>(emptyFeatureItem());

  function resetEditor() {
    setIsCreating(false);
    setIsEditing(false);
    setBlockType("list");
    setEyebrow("");
    setHeading("");
    setGradientText("");
    setItemsHeading("");
    setDescription("");
    setPosition("left");
    setListItems([]);
    setFeatureItems([]);
    setNewListItem("");
    setNewFeatureItem(emptyFeatureItem());
  }

  function startCreating() {
    resetEditor();
    setIsCreating(true);
  }

  function startEditing() {
    if (!block) return;

    setIsCreating(false);
    setIsEditing(true);
    setIsExpanded(true);

    setBlockType(block.block_type);
    setEyebrow(block.eyebrow ?? "");
    setHeading(block.heading);
    setGradientText(block.gradient_text ?? "");
    setItemsHeading(block.items_heading ?? "");
    setDescription(block.description ?? "");
    setPosition(block.layout_position);

    if (block.block_type === "list") {
      setListItems(
        block.items.filter(
          (item): item is string => typeof item === "string"
        )
      );
      setFeatureItems([]);
    } else {
      setFeatureItems(
        block.items
          .filter(
            (item): item is FeatureItem =>
              typeof item !== "string" &&
              typeof item.title === "string" &&
              typeof item.description === "string"
          )
          .map((item) => ({
            title: item.title,
            description: item.description,
          }))
      );
      setListItems([]);
    }

    setNewListItem("");
    setNewFeatureItem(emptyFeatureItem());
  }

  function changeBlockType(value: "list" | "feature") {
    setBlockType(value);
    setListItems([]);
    setFeatureItems([]);
    setNewListItem("");
    setNewFeatureItem(emptyFeatureItem());

    if (value === "feature") {
      setItemsHeading("");
    }
  }

  function addListItem() {
    const value = newListItem.trim();

    if (!value) return;

    setListItems((current) => [...current, value]);
    setNewListItem("");
  }

  function addFeatureItem() {
    const title = newFeatureItem.title.trim();
    const itemDescription = newFeatureItem.description.trim();

    if (!title || !itemDescription) return;

    setFeatureItems((current) => [
      ...current,
      { title, description: itemDescription },
    ]);

    setNewFeatureItem(emptyFeatureItem());
  }

  function moveListItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= listItems.length) return;

    setListItems((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function moveFeatureItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= featureItems.length) return;

    setFeatureItems((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function renderItemsField() {
    const items: ServiceContentBlockItem[] =
      blockType === "list" ? listItems : featureItems;

    return (
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items)}
      />
    );
  }

  function renderEditor(isNew: boolean) {
    return (
      <form
        action={
          isNew
            ? createServiceContentBlock
            : updateServiceContentBlock
        }
        className="mt-5 space-y-5 rounded-xl border border-white/10 bg-[#0D1023]/70 p-5"
      >
        {isNew ? (
          <input
            type="hidden"
            name="service_section_id"
            value={sectionId}
          />
        ) : (
          <input
            type="hidden"
            name="id"
            value={block?.id ?? ""}
          />
        )}

        <input type="hidden" name="block_type" value={blockType} />
        <input type="hidden" name="eyebrow" value={eyebrow} />
        <input type="hidden" name="heading" value={heading} />
        <input
          type="hidden"
          name="gradient_text"
          value={gradientText}
        />
        <input
          type="hidden"
          name="items_heading"
          value={blockType === "list" ? itemsHeading : ""}
        />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="layout_position" value={position} />

        {renderItemsField()}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-[#C5BFD0]">
            Block Type
            <select
              value={blockType}
              onChange={(event) =>
                changeBlockType(event.target.value as "list" | "feature")
              }
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
            >
              <option value="list">List Block</option>
              <option value="feature">Feature Block</option>
            </select>
          </label>

          <label className="block text-sm text-[#C5BFD0]">
            Layout Position
            <select
              value={position}
              onChange={(event) =>
                setPosition(event.target.value as "left" | "right")
              }
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>

        <label className="block text-sm text-[#C5BFD0]">
          Eyebrow Label (optional)
          <input
            value={eyebrow}
            onChange={(event) => setEyebrow(event.target.value)}
            placeholder="e.g. Game genres"
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
          />
        </label>

        <label className="block text-sm text-[#C5BFD0]">
          Heading
          <input
            required
            value={heading}
            onChange={(event) => setHeading(event.target.value)}
            placeholder="Enter the main heading"
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
          />
        </label>

        <label className="block text-sm text-[#C5BFD0]">
          Gradient Text (optional)
          <input
            value={gradientText}
            onChange={(event) => setGradientText(event.target.value)}
            placeholder="e.g. player."
            className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
          />
          <span className="mt-2 block text-xs text-[#8F899F]">
            Enter the exact word or phrase from the heading that should use
            the gradient. Leave blank for a plain white heading.
          </span>
        </label>

        {blockType === "list" && (
          <label className="block text-sm text-[#C5BFD0]">
            List Card Heading
            <input
              required
              value={itemsHeading}
              onChange={(event) => setItemsHeading(event.target.value)}
              placeholder="e.g. Explore the possibilities"
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
            />

            <span className="mt-2 block text-xs text-[#8F899F]">
              This heading appears above the list items inside the card.
            </span>
          </label>
        )}

        <label className="block text-sm text-[#C5BFD0]">
          Intro Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Write a short introduction..."
            className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
          />
        </label>

        <div>
          <p className="mb-3 text-sm font-semibold text-[#F0CA77]">
            Block Items
          </p>

          {blockType === "list" ? (
            <div className="space-y-3">
              {listItems.map((item, index) => (
                <div
                  key={`${index}-${item}`}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#15162D] p-3"
                >
                  <span className="min-w-0 flex-1 text-sm text-[#FFFDF8]">
                    {item}
                  </span>

                  <button
                    type="button"
                    onClick={() => moveListItem(index, -1)}
                    disabled={index === 0}
                    className="rounded px-2 py-1 text-[#C5BFD0] hover:text-[#F0CA77] disabled:opacity-30"
                    aria-label="Move item up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveListItem(index, 1)}
                    disabled={index === listItems.length - 1}
                    className="rounded px-2 py-1 text-[#C5BFD0] hover:text-[#F0CA77] disabled:opacity-30"
                    aria-label="Move item down"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setListItems((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                    className="rounded px-2 py-1 text-red-300 hover:text-red-200"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={newListItem}
                  onChange={(event) => setNewListItem(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addListItem();
                    }
                  }}
                  placeholder="Add a list item"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
                />

                <button
                  type="button"
                  onClick={addListItem}
                  className="rounded-lg border border-[#DE8A61]/40 px-4 py-3 text-sm text-[#F0CA77] transition hover:bg-[#DE8A61]/10"
                >
                  Add Item
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {featureItems.map((item, index) => (
                <div
                  key={`${index}-${item.title}`}
                  className="rounded-lg border border-white/10 bg-[#15162D] p-4"
                >
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 font-semibold text-[#F0CA77]">
                      {item.title}
                    </p>

                    <button
                      type="button"
                      onClick={() => moveFeatureItem(index, -1)}
                      disabled={index === 0}
                      className="rounded px-2 py-1 text-[#C5BFD0] hover:text-[#F0CA77] disabled:opacity-30"
                      aria-label="Move item up"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() => moveFeatureItem(index, 1)}
                      disabled={index === featureItems.length - 1}
                      className="rounded px-2 py-1 text-[#C5BFD0] hover:text-[#F0CA77] disabled:opacity-30"
                      aria-label="Move item down"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFeatureItems((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      className="rounded px-2 py-1 text-red-300 hover:text-red-200"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm text-[#C5BFD0]">
                    {item.description}
                  </p>
                </div>
              ))}

              <div className="space-y-3 rounded-lg border border-white/10 bg-[#15162D]/60 p-4">
                <p className="text-sm font-medium text-[#C5BFD0]">
                  Add a feature item
                </p>

                <input
                  value={newFeatureItem.title}
                  onChange={(event) =>
                    setNewFeatureItem((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Title"
                  className="w-full rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
                />

                <textarea
                  value={newFeatureItem.description}
                  onChange={(event) =>
                    setNewFeatureItem((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Description"
                  className="w-full resize-y rounded-lg border border-white/10 bg-[#15162D] px-3 py-3 text-sm text-[#FFFDF8] outline-none focus:border-[#DE8A61]"
                />

                <button
                  type="button"
                  onClick={addFeatureItem}
                  className="rounded-lg border border-[#DE8A61]/40 px-4 py-2 text-sm text-[#F0CA77] transition hover:bg-[#DE8A61]/10"
                >
                  Add Feature
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
          <PendingSubmitButton
            pendingText={isNew ? "Creating..." : "Saving..."}
            disabled={
              !heading.trim() ||
              (blockType === "list"
                ? !itemsHeading.trim() || listItems.length === 0
                : featureItems.length === 0)
            }
            className="rounded-lg bg-gradient-to-r from-[#934C60] to-[#DE8A61] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isNew ? "Create Content Block" : "Save Changes"}
          </PendingSubmitButton>

          <button
            type="button"
            onClick={resetEditor}
            className="rounded-lg border border-white/15 px-5 py-3 text-sm text-[#C5BFD0] transition hover:border-white/30 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DE8A61]">
            Additional Content
          </p>

          <p className="mt-1 text-sm text-[#C5BFD0]">
            {block
              ? "This section has a content block."
              : "This section does not have a content block yet."}
          </p>
        </div>

        {!block && !isCreating && (
          <button
            type="button"
            onClick={startCreating}
            className="shrink-0 rounded-lg border border-[#DE8A61]/40 px-4 py-2.5 text-sm font-semibold text-[#F0CA77] transition hover:bg-[#DE8A61]/10"
          >
            + Add Content Block
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mt-4 rounded-2xl border border-[#DE8A61]/30 bg-[#15162D]/80 p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#DE8A61]">
              New Content Block
            </p>
            <h4 className="mt-1 font-semibold text-[#F0CA77]">
              {sectionName}
            </h4>
          </div>

          {renderEditor(true)}
        </div>
      )}

      {block && (
        <div className="mt-4 rounded-xl border border-white/10 bg-[#15162D]/70 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              aria-expanded={isExpanded}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span className="rounded-full border border-[#DE8A61]/30 bg-[#DE8A61]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#F0CA77]">
                {block.block_type}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  block.is_published
                    ? "border border-green-400/20 bg-green-400/10 text-green-300"
                    : "border border-white/10 bg-white/5 text-[#C5BFD0]"
                }`}
              >
                {block.is_published ? "Published" : "Draft"}
              </span>

              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#FFFDF8]">
                {block.heading}
              </span>

              <span className="shrink-0 px-1 text-lg text-[#F0CA77]">
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            <div className="flex shrink-0 flex-wrap gap-2">
              <form action={toggleServiceContentBlockPublished}>
                <input type="hidden" name="id" value={block.id} />

                <PendingSubmitButton
                  pendingText={
                    block.is_published ? "Unpublishing..." : "Publishing..."
                  }
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#C5BFD0] transition hover:border-[#F0CA77]/40 hover:text-[#F0CA77]"
                >
                  {block.is_published ? "Unpublish" : "Publish"}
                </PendingSubmitButton>
              </form>

              <button
                type="button"
                onClick={startEditing}
                className="rounded-lg border border-[#DE8A61]/30 px-3 py-2 text-xs text-[#F0CA77] transition hover:bg-[#DE8A61]/10"
              >
                Edit
              </button>

              <form
                action={deleteServiceContentBlock}
                onSubmit={(event) => {
                  if (
                    !window.confirm(
                      `Delete the content block for "${sectionName}"? This cannot be undone.`
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={block.id} />

                <PendingSubmitButton
                  pendingText="Deleting..."
                  className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
                >
                  Delete
                </PendingSubmitButton>
              </form>
            </div>
          </div>

          {isExpanded && !isEditing && (
            <div className="mt-4 border-t border-white/10 pt-4">
              {block.eyebrow && (
                <p className="mb-1 text-xs uppercase tracking-wider text-[#DE8A61]">
                  {block.eyebrow}
                </p>
              )}

              <p className="text-xs text-[#8F899F]">
                Layout position: {block.layout_position}
              </p>

              {block.gradient_text && (
                <p className="mt-2 text-xs text-[#8F899F]">
                  Gradient text: {block.gradient_text}
                </p>
              )}

              {block.block_type === "list" && block.items_heading && (
                <p className="mt-3 text-sm font-medium text-[#F0CA77]">
                  List card: {block.items_heading}
                </p>
              )}

              {block.description && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-[#C5BFD0]">
                  {block.description}
                </p>
              )}

              <p className="mt-2 text-xs text-[#8F899F]">
                {block.items.length}{" "}
                {block.items.length === 1 ? "item" : "items"}
              </p>
            </div>
          )}

          {isEditing && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="font-semibold text-[#F0CA77]">
                Edit Content Block
              </h4>

              {renderEditor(false)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
