import { describe, expect, it } from "vitest";
import { parseHTMLListToItem, serializeItemToHTML } from "./richtext";
import { _expectedItem, _item, _rootItem } from "./test-utils";

describe("parseHTMLListToItem", () => {
	it("should parse HTML list to item", async () => {
		const html = `
      <ul>
        <li>Item 1</li>
        <li>Item 2
          <ul>
            <li>Item 2.1
              <ul>
                <li>Item 2.1.1</li>
              </ul>
            </li>
            <li>Item 2.2</li>
          <ul>
        </li>
        <li>Item 3</li>
      </ul>
    `;
		const item = await parseHTMLListToItem(html);
		expect(item).toEqual(
			_rootItem([
				_expectedItem({ description: "Item 1" }),
				_expectedItem({
					description: "Item 2",
					children: [
						_expectedItem({
							description: "Item 2.1",
							children: [_expectedItem({ description: "Item 2.1.1" })],
						}),
						_expectedItem({ description: "Item 2.2" }),
					],
				}),
				_expectedItem({ description: "Item 3" }),
			]),
		);
	});

	it("should throw error if no list found", async () => {
		const html = "<div></div>";
		await expect(parseHTMLListToItem(html)).rejects.toThrow("No list found in HTML");
	});

	it("should parse empty list", async () => {
		const html = "<ul></ul>";
		const item = await parseHTMLListToItem(html);
		expect(item).toEqual(_rootItem([]));
	});

	it("should ignore things other than li and ul", async () => {
		const html = `
      <ul>
        <li>Item 1</li>
        <div>Item 2</div>
        <li>Item 3</li>
      </ul>
    `;
		const item = await parseHTMLListToItem(html);
		expect(item).toEqual(
			_rootItem([
				_expectedItem({ description: "Item 1" }),
				_expectedItem({ description: "Item 3" }),
			]),
		);
	});

	it("should parse multiple uls", async () => {
		const html = `
      <ul>
        <li>Item 1</li>
      </ul>
      <ul>
        <li>Item 2</li>
      </ul>
    `;
		const item = await parseHTMLListToItem(html);
		expect(item).toEqual(
			_rootItem([
				_expectedItem({ description: "Item 1" }),
				_expectedItem({ description: "Item 2" }),
			]),
		);
	});
});

describe("serializeItemToHTML", () => {
	it("should serialize item to HTML", () => {
		const item = _rootItem([
			_item({ description: "Item 1" }),
			_item({
				description: "Item 2",
				children: [
					_item({
						description: "Item 2.1",
						children: [_item({ description: "Item 2.1.1" })],
					}),
					_item({ description: "Item 2.2" }),
				],
			}),
			_item({ description: "Item 3" }),
		]);
		const html = serializeItemToHTML(item);
		expect(html).toBe(
			`<ul>
  <li>Item 1</li>
  <li>Item 2
    <ul>
      <li>Item 2.1
        <ul>
          <li>Item 2.1.1</li>
        </ul>
      </li>
      <li>Item 2.2</li>
    </ul>
  </li>
  <li>Item 3</li>
</ul>`,
		);
	});
});
