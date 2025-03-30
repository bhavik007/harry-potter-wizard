import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { createElement, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Loading = () => {
  return /* @__PURE__ */ jsxs("div", { className: "loading-container", children: [
    /* @__PURE__ */ jsx("div", { className: "loading-spinner" }),
    /* @__PURE__ */ jsx("p", { children: "Loading..." })
  ] });
};
const Table = ({ data, columns, rowsPerPage = 5, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPageState, setRowsPerPageState] = useState(rowsPerPage);
  const totalPages = Math.ceil(data.length / rowsPerPageState);
  const paginatedData = data.slice((currentPage - 1) * rowsPerPageState, currentPage * rowsPerPageState);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleFirstPage = () => {
    setCurrentPage(1);
  };
  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPageState(Number(event.target.value));
    setCurrentPage(1);
  };
  return /* @__PURE__ */ jsx("div", { className: "table-container", children: loading ? /* @__PURE__ */ jsx(Loading, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("table", { className: "table", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: columns.map((column) => /* @__PURE__ */ jsx("th", { className: "table-header", children: column.header }, String(column.accessor))) }) }),
      /* @__PURE__ */ jsx("tbody", { children: paginatedData.map((row, rowIndex) => /* @__PURE__ */ jsx("tr", { className: "table-row", children: columns.map((column) => /* @__PURE__ */ jsx("td", { children: column.customRow ? column.customRow(row[column.accessor], row) : String(row[column.accessor] || "-") }, String(column.accessor))) }, rowIndex)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "table-pagination", children: [
      /* @__PURE__ */ jsxs("div", { className: "rows-per-page", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "rowsPerPage", children: "Rows per page:" }),
        /* @__PURE__ */ jsxs("select", { id: "rowsPerPage", value: rowsPerPageState, onChange: handleRowsPerPageChange, children: [
          /* @__PURE__ */ jsx("option", { value: 5, children: "5" }),
          /* @__PURE__ */ jsx("option", { value: 10, children: "10" }),
          /* @__PURE__ */ jsx("option", { value: 20, children: "20" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pagination-controls", children: [
        /* @__PURE__ */ jsx("button", { onClick: handleFirstPage, disabled: currentPage === 1, children: "First" }),
        /* @__PURE__ */ jsx("button", { onClick: handlePreviousPage, disabled: currentPage === 1, children: "Previous" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "Page ",
          currentPage,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: handleNextPage, disabled: currentPage === totalPages, children: "Next" }),
        /* @__PURE__ */ jsx("button", { onClick: handleLastPage, disabled: currentPage === totalPages, children: "Last" })
      ] })
    ] })
  ] }) });
};
const Dropdown = ({
  items,
  onSelect,
  labelKey,
  placeholder = "Select an option"
}) => {
  const uniqueItems = React.useMemo(() => {
    if (labelKey) {
      const seen = /* @__PURE__ */ new Set();
      return items.filter((item) => {
        const label = item[labelKey];
        if (seen.has(label)) {
          return false;
        }
        seen.add(label);
        return true;
      });
    }
    return Array.from(new Set(items));
  }, [items, labelKey]);
  const handleChange = (event) => {
    const selectedIndex = event.target.value;
    if (selectedIndex !== "") {
      onSelect(uniqueItems[parseInt(selectedIndex, 10)]);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "dropdown-container", children: /* @__PURE__ */ jsxs("select", { className: "dropdown", onChange: handleChange, defaultValue: "", children: [
    /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: placeholder }),
    uniqueItems.map((item, index) => /* @__PURE__ */ jsx("option", { value: index, children: labelKey ? item[labelKey] : String(item) }, index))
  ] }) });
};
const Textbox = ({ value, onChange, placeholder = "Enter text" }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return /* @__PURE__ */ jsx("div", { className: "textbox-container", children: /* @__PURE__ */ jsx(
    "input",
    {
      type: "text",
      className: "textbox",
      value,
      onChange: handleChange,
      placeholder
    }
  ) });
};
function meta({}) {
  return [{
    title: "Harry Potter Wizard"
  }];
}
const home = withComponentProps(function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    Name: "",
    Ingredient: "",
    InventorFullName: "",
    Manufacturer: ""
  });
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  const difficulties = [{
    key: "Unknown"
  }, {
    key: "Advanced"
  }, {
    key: "Moderate"
  }, {
    key: "Beginner"
  }, {
    key: "OrdinaryWizardingLevel"
  }, {
    key: "OneOfAKind"
  }];
  const columns = [{
    header: "Name",
    accessor: "name"
  }, {
    header: "Difficulty",
    accessor: "difficulty"
  }, {
    header: "Ingredients",
    accessor: "ingredients",
    customRow: (value, row) => Array.isArray(value) && value.length ? value.map((ingredient) => ingredient.name).join(", ") || "" : "-"
  }, {
    header: "Inventor Full Name",
    accessor: "inventors",
    customRow: (value, row) => Array.isArray(value) && value.length ? value.map((name, index) => /* @__PURE__ */ jsxs(React.Fragment, {
      children: [`${name.firstName} ${name.lastName}`, /* @__PURE__ */ jsx("br", {})]
    }, index)) : "-"
  }, {
    header: "Manufacturer",
    accessor: "manufacturer"
  }];
  const fetchElixirs = async (qs = "") => {
    try {
      setLoading(true);
      const response = await fetch("https://wizard-world-api.herokuapp.com/Elixirs?" + qs);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const elixirs = await response.json();
      setData(elixirs);
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchElixirs();
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 1e3);
    return () => {
      clearTimeout(handler);
    };
  }, [filter]);
  useEffect(() => {
    const filterQuery = Object.entries(debouncedFilter).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`).join("&");
    fetchElixirs(filterQuery);
  }, [debouncedFilter]);
  const handleDropdownSelect = (selectedItem) => {
    setFilter({
      Name: "",
      Ingredient: "",
      InventorFullName: "",
      Manufacturer: ""
    });
    fetchElixirs(`difficulty=${selectedItem.key}`);
  };
  const handleFilterChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value
    }));
  };
  if (error) {
    return /* @__PURE__ */ jsxs("div", {
      children: ["Error: ", error]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "container",
    children: [/* @__PURE__ */ jsx("div", {
      className: "header",
      children: /* @__PURE__ */ jsx("h1", {
        children: "Hogwarts Elixirs"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "filter-dropdown-container",
      children: [/* @__PURE__ */ jsx("div", {
        className: "filter-container",
        children: Object.keys(filter).map((key) => /* @__PURE__ */ jsx(Textbox, {
          value: filter[key],
          onChange: (value) => handleFilterChange(key, value),
          placeholder: `Search by ${key}`
        }, key))
      }), /* @__PURE__ */ jsx("div", {
        className: "dropdown-container",
        children: /* @__PURE__ */ jsx(Dropdown, {
          items: difficulties,
          onSelect: handleDropdownSelect,
          labelKey: "key",
          placeholder: "Select Difficulty"
        })
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "table-container",
      children: /* @__PURE__ */ jsx(Table, {
        data,
        columns,
        rowsPerPage: 5,
        loading
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BrjxmDe7.js", "imports": ["/assets/chunk-XJI4KG32-BXFEWMgV.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CrrYPKf0.js", "imports": ["/assets/chunk-XJI4KG32-BXFEWMgV.js", "/assets/with-props-B3HCb01j.js"], "css": ["/assets/root-DvU9tYT3.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-B9CzJ2Z3.js", "imports": ["/assets/with-props-B3HCb01j.js", "/assets/chunk-XJI4KG32-BXFEWMgV.js"], "css": ["/assets/home-CHocLrME.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-0516b00f.js", "version": "0516b00f" };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
