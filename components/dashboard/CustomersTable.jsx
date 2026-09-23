"use client";

import { useMemo, useState } from "react";
import { Table } from "@heroui/react";

const matchesQuery = (customer, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystacks = [
    customer.name ?? "",
    customer.email ?? "",
    customer.phone ?? "",
  ].map((v) => String(v).toLowerCase());
  return haystacks.some((h) => h.includes(q));
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function CustomersTable({ customers }) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const list = Array.isArray(customers) ? customers : [];
    return list.filter((customer) => matchesQuery(customer, query));
  }, [customers, query]);

  const total = Array.isArray(customers) ? customers.length : 0;

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="customers-search" className="sr-only">
          Search customers
        </label>
        <input
          id="customers-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-fog outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 sm:max-w-sm"
        />
        {query.trim() ? (
          <p className="text-sm text-smoke sm:ml-auto">
            {rows.length} of {total} customers
          </p>
        ) : null}
      </div>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Customers" className="min-w-190">
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Email</Table.Column>
              <Table.Column>Phone</Table.Column>
              <Table.Column>Joined</Table.Column>
            </Table.Header>
            <Table.Body>
              {rows.map((customer) => {
                const id = String(customer._id);
                return (
                  <Table.Row key={id}>
                    <Table.Cell className="font-bold">
                      {customer.name || "—"}
                    </Table.Cell>
                    <Table.Cell>
                      <span className="block font-semibold text-ink">
                        {customer.email || "—"}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="block font-semibold text-ink">
                        {customer.phone || "—"}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="text-smoke">
                      {formatDate(customer.createdAt)}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center text-sm text-smoke">
          No customers found. Try a different search.
        </p>
      ) : null}
    </>
  );
}
