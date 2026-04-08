"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  productsApi,
  Product,
  ProductCreate,
  PRODUCT_CATEGORIES,
  ProductCategory,
} from "@/lib/api/products";
import { cartApi } from "@/lib/api/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Backbutton } from "@/app/components/Backbutton";

export default function ProductsPage() {
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Estados principais
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<Record<number, string>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estados do modal de criação/edição
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreate>({
    name: "",
    price: 0,
    stock: 0,
    category: "Maquiagem",
    validity: new Date().toISOString().slice(0, 16),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados do modal de detalhes
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estados do modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para adicionar ao carrinho
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Quantidades selecionadas por produto
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProductImages = useCallback(
    async (productList: Product[]) => {
      if (!token) return;

      const images: Record<number, string> = {};

      for (const product of productList) {
        try {
          const imageBase64 = await productsApi.getProductImage(
            product.id,
            token,
          );
          if (imageBase64) {
            images[product.id] = `data:image/jpeg;base64,${imageBase64}`;
          }
        } catch {
          // Produto sem imagem
        }
      }

      setProductImages(images);
    },
    [token],
  );

  const loadProducts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("[PRODUCTS] Carregando produtos...");
      const data = await productsApi.getAllProducts(token);
      console.log("[PRODUCTS] Produtos carregados:", data.length);
      setProducts(data);

      // Carregar imagens para cada produto
      loadProductImages(data);
      // Inicializar quantidades com valor padrão 1
      const initialQtys: Record<number, number> = {};
      data.forEach((p: Product) => (initialQtys[p.id] = 1));
      setQuantities(initialQtys);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar produtos";
      console.error("[PRODUCTS] Erro ao carregar produtos:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token, loadProductImages]);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Carregar produtos
  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token, loadProducts]);

  // Abrir modal para criar produto
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      stock: 0,
      category: "Maquiagem",
      validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  // Abrir modal para editar produto
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      validity: product.validity.slice(0, 16),
    });
    setImageFile(null);
    setImagePreview(productImages[product.id] || null);
    setShowModal(true);
  };

  // Abrir modal de detalhes
  const openDetailsModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  // Abrir modal de confirmação de exclusão
  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Lidar com seleção de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar produto (criar ou atualizar)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validar campos obrigatórios
    if (!formData.name.trim()) {
      setError("Nome do produto é obrigatório");
      return;
    }

    if (formData.price <= 0) {
      setError("Preço deve ser maior que 0");
      return;
    }

    if (formData.stock < 0) {
      setError("Estoque não pode ser negativo");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      let savedProduct: Product;

      if (editingProduct) {
        // Atualizar produto existente
        console.log("[PRODUCTS] Atualizando produto:", editingProduct.id);
        savedProduct = await productsApi.updateProduct(
          editingProduct.id,
          formData,
          token,
        );
        setSuccess("Produto atualizado com sucesso!");
      } else {
        // Criar novo produto
        console.log("[PRODUCTS] Criando novo produto:", formData.name);
        savedProduct = await productsApi.createProduct(formData, token);
        setSuccess("Produto criado com sucesso!");
      }

      // Upload de imagem se selecionada
      if (imageFile) {
        console.log("[PRODUCTS] Fazendo upload da imagem...");
        await productsApi.uploadProductImage(savedProduct.id, imageFile, token);
      }

      // Recarregar lista
      await loadProducts();
      setShowModal(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao salvar produto";
      console.error("[PRODUCTS] Erro ao salvar produto:", err);
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Deletar produto
  const handleDeleteProduct = async () => {
    if (!token || !productToDelete) return;

    setIsDeleting(true);
    setError("");

    try {
      console.log("[PRODUCTS] Deletando produto:", productToDelete.id);
      await productsApi.deleteProduct(productToDelete.id, token);
      setSuccess("Produto deletado com sucesso!");
      await loadProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar produto";
      console.error("[PRODUCTS] Erro ao deletar produto:", err);
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  // Atualizar quantidade selecionada
  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, value) }));
  };

  // Adicionar ao carrinho (para clientes)
  const handleAddToCart = async (product: Product, qty?: number) => {
    if (!token || !user) return;

    const quantity = qty ?? quantities[product.id] ?? 1;
    const finalQty = Math.max(1, Math.min(quantity, product.stock));

    setAddingToCart(product.id);
    setError("");

    try {
      console.log(
        "[PRODUCTS] Adicionando ao carrinho:",
        product.id,
        "count:",
        finalQty,
      );
      await cartApi.addToCart(
        {
          user_id: user.id,
          product_id: product.id,
          count: finalQty,
        },
        token,
      );
      setSuccess(`${product.name} (x${finalQty}) adicionado ao carrinho!`);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao adicionar ao carrinho";
      console.error("[PRODUCTS] Erro ao adicionar ao carrinho:", err);
      setError(errorMessage);
    } finally {
      setAddingToCart(null);
    }
  };

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Loading inicial
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-start gap-2 sm:gap-3 flex-nowrap">
            <Link
              href="/"
              className="flex items-center gap-1 sm:gap-2 min-w-fit flex-shrink-0"
            >
              <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex-shrink-0">
                <span className="text-base sm:text-lg">🦋</span>
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                Produtos
              </h1>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Backbutton />
              {user.is_admin && (
                <button
                  onClick={openCreateModal}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                >
                  <span className="hidden sm:inline">+ Novo Produto</span>
                  <span className="sm:hidden">+</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens de feedback */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">⚠️ {error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800">✅ {success}</p>
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de produtos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-700 text-lg">
              {searchTerm || categoryFilter !== "all"
                ? "Nenhum produto encontrado com os filtros aplicados."
                : "Nenhum produto cadastrado ainda."}
            </p>
            {user.is_admin && !searchTerm && categoryFilter === "all" && (
              <button
                onClick={openCreateModal}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg"
              >
                Criar primeiro produto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
              >
                {/* Imagem do produto */}
                <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
                  {productImages[product.id] ? (
                    <img
                      src={productImages[product.id]}
                      alt={product.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl opacity-50">💄</span>
                  )}

                  {/* Badge de categoria */}
                  <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                    {product.category}
                  </span>

                  {/* Badge de estoque */}
                  {product.stock <= 5 && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {product.stock === 0
                        ? "Esgotado"
                        : `Últimas ${product.stock}`}
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                    {product.name}
                  </h3>

                  <p className="text-2xl font-bold text-blue-600 mb-2">
                    {formatPrice(product.price)}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-700 mb-4">
                    <span>Estoque: {product.stock}</span>
                    <span>Val: {formatDate(product.validity)}</span>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {user.is_admin ? (
                      <>
                        <button
                          onClick={() => openDetailsModal(product)}
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <div className="flex gap-2 w-full items-center">
                        <button
                          onClick={() => openDetailsModal(product)}
                          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition text-sm font-medium"
                        >
                          Ver detalhes
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={product.stock}
                          value={quantities[product.id] ?? 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              parseInt(e.target.value || "1", 10),
                            )
                          }
                          className="w-16 px-2 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-center text-sm"
                        />
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            product.stock === 0 || addingToCart === product.id
                          }
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition text-sm font-medium"
                        >
                          {addingToCart === product.id
                            ? "..."
                            : product.stock === 0
                              ? "Esgotado"
                              : "🛒 Adicionar"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Criar/Editar Produto */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg my-4 max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h2>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Preço e Estoque */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price === 0 ? "" : formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        price: value === "" ? 0 : parseFloat(value) || 0,
                      });
                    }}
                    onBlur={() => {
                      if (formData.price === 0) {
                        setFormData({
                          ...formData,
                          price: 0,
                        });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock === 0 ? "" : formData.stock}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        stock: value === "" ? 0 : parseInt(value) || 0,
                      });
                    }}
                    onBlur={() => {
                      if (formData.stock === 0) {
                        setFormData({
                          ...formData,
                          stock: 0,
                        });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as ProductCategory,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Validade */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Data de Validade *
                </label>
                <input
                  type="datetime-local"
                  value={formData.validity}
                  onChange={(e) =>
                    setFormData({ ...formData, validity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Imagem */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Imagem do Produto
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center cursor-pointer hover:border-green-500 transition overflow-hidden"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl text-gray-400">📷</span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="text-sm text-gray-700">
                    Clique para selecionar uma imagem
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition font-medium"
                >
                  {isSaving
                    ? "Salvando..."
                    : editingProduct
                      ? "Atualizar"
                      : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg my-4 max-h-[95vh] overflow-y-auto">
            <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-slate-700 dark:to-slate-600 rounded-t-2xl flex items-center justify-center">
              {productImages[selectedProduct.id] ? (
                <img
                  src={productImages[selectedProduct.id]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              ) : (
                <span className="text-8xl opacity-50">💄</span>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full mb-3">
                {selectedProduct.category}
              </span>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedProduct.name}
              </h2>

              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-6">
                {formatPrice(selectedProduct.price)}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Estoque
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedProduct.stock} unidades
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Validade
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatDate(selectedProduct.validity)}
                  </p>
                </div>
              </div>

              {!user.is_admin && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Quantidade:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={selectedProduct.stock}
                      value={quantities[selectedProduct.id] ?? 1}
                      onChange={(e) =>
                        handleQuantityChange(
                          selectedProduct.id,
                          parseInt(e.target.value || "1", 10),
                        )
                      }
                      className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-center"
                    />
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(
                        selectedProduct,
                        quantities[selectedProduct.id] ?? 1,
                      );
                      setShowDetailsModal(false);
                    }}
                    disabled={selectedProduct.stock === 0}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg transition font-bold"
                  >
                    {selectedProduct.stock === 0
                      ? "Produto Esgotado"
                      : "🛒 Adicionar ao Carrinho"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6 mx-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🗑️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Confirmar Exclusão
              </h2>
              <p className="text-gray-700">
                Tem certeza que deseja excluir o produto{" "}
                <strong className="text-gray-900 dark:text-white">
                  {productToDelete.name}
                </strong>
                ?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition font-medium"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
