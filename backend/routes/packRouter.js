import express from "express";
import Pack from "../models/packModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";

const packRouter = express.Router();

//////Afficher Pack /////////////////
packRouter.get("/", async (req, res) => {
  const packs = await Pack.find();
  res.send(packs);
});

///////////////Ajouter Pack /////////////////
packRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newPack = new Pack({
      name: "sample name " + Date.now(),
      slug: "sample-name-" + Date.now(),
      image: "/images/p1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "sample description",
    });
    const pack = await newPack.save();
    res.send({ message: "Pack Created", pack });
  })
);

////////////////UPDate Pack//////////////////////
packRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const packtId = req.params.id;
    const pack = await Pack.findById(packtId);
    if (pack) {
      pack.name = req.body.name;
      pack.slug = req.body.slug;
      pack.price = req.body.price;
      pack.image = req.body.image;
      pack.category = req.body.category;
      pack.brand = req.body.brand;
      pack.countInStock = req.body.countInStock;
      pack.description = req.body.description;
      await pack.save();
      res.send({ message: "Pack Updated" });
    } else {
      res.status(404).send({ message: "Pack Not Found" });
    }
  })
);

////////////////Delete Pack /////////////////////

packRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const pack = await Pack.findById(req.params.id);
    if (pack) {
      await pack.deleteOne();
      res.send({ message: "Pack Deleted" });
    } else {
      res.status(404).send({ message: "Pack Not Found" });
    }
  })
);
const PAGE_SIZE = 3;
//////////////Afficher pack pour l'admin/////////////
packRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const packs = await Pack.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countPacks = await Pack.countDocuments();
    res.send({
      packs,
      countPacks,
      page,
      pages: Math.ceil(countPacks / pageSize),
    });
  })
);
//////////////////////Recherche////////////////////////////
packRouter.get(
  "/search",
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1; //page par defaut 1
    const category = query.category || ""; //category = query.category  ou bien le vide
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";

    const queryFilter =
      //if searchQuery exist and deffirent de all
      searchQuery && searchQuery !== "all" //"all" est utilisé pour représenter l'absence d'un filtre spécifique
        ? {
            name: {
              // une recherche sur le champ "name" des packs.
              $regex: searchQuery,
              $options: "i", //recherche avec majuscules ou minuscules
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {}; //creation de d'un filtre de recherche Si category est spécifié avec une valeur différente de "all", le filtre est créé en utilisant cette valeur. Sinon, aucun filtre n'est appliqué sur la catégorie.
    const ratingFilter =
      rating && rating !== "all" //"all" est utilisé pour représenter l'absence d'un filtre spécifique
        ? {
            //seuls les packs ayant un rating supérieur ou égal à cette valeur seront inclus dans les résultats. Sinon, aucun filtre n'est appliqué sur le rating.
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all" //"all" est utilisé pour représenter l'absence d'un filtre spécifique
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]), //Cela spécifie que le prix doit être supérieur ou égal à la valeur X (prix minimum).
              $lte: Number(price.split("-")[1]), // Cela spécifie que le prix doit être inférieur ou égal à la valeur Y (prix maximum).
            },
          }
        : {};
    const sortOrder =
      order === "featured" //es packs seront triés par ordre décroissant de leur propriété featured.
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 } //ordre croissant
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const packs = await Pack.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    // ce code permet de compter le nombre total de packs qui correspondent aux filtres spécifiés
    const countPacks = await Pack.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    //e nombre total de packs, le numéro de page actuel et le nombre total de pages disponibles pour la pagination
    res.send({
      packs,
      countPacks,
      page,
      pages: Math.ceil(countPacks / pageSize),
    });
  })
);

///////////Afficher category de pack //////////////

packRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Pack.find().distinct("category");
    res.send(categories);
  })
);

//////////////Reviews/////////////////

packRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const packtId = req.params.id;
    const pack = await Pack.findById(packtId);
    if (pack) {
      if (pack.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      pack.reviews.push(review);
      pack.numReviews = pack.reviews.length;
      pack.rating =
        pack.reviews.reduce((a, c) => c.rating + a, 0) / pack.reviews.length;
      const updatedPack = await pack.save();
      res.status(201).send({
        message: "Review Created",
        review: updatedPack.reviews[updatedPack.reviews.length - 1],
        numReviews: pack.numReviews,
        rating: pack.rating,
      });
    } else {
      res.status(404).send({ message: "Pack Not Found" });
    }
  })
);

packRouter.get("/slug/:slug", async (req, res) => {
  const pack = await Pack.findOne({ slug: req.params.slug }).exec();
  if (pack) {
    res.send(pack);
  } else {
    res.status(404).send({ message: "Pack Not Found" });
  }
});
packRouter.get("/:id", async (req, res) => {
  const pack = await Pack.findById(req.params.id);
  if (pack) {
    res.send(pack);
  } else {
    res.status(404).send({ message: "Pack Not Found" });
  }
});

export default packRouter;
