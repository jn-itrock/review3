import { HttpException, HttpStatus } from "@nestjs/common";
import {
  AggregateOptions,
  Document,
  FilterQuery,
  HydratedDocument,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { Model } from "../../shared/db/plugins/softDelete.interface";
import { EntityNotFound } from "../../shared/exceptions/exceptions";

export abstract class BaseRepository<T extends Document> {
  constructor(private readonly entityModel: Model<T>) {}

  aggregate = async <U>(
    pipeline?: PipelineStage[],
    options?: AggregateOptions
  ): Promise<U[]> => {
    return await this.entityModel.aggregate(pipeline, options).exec();
  };

  count = async (filter: FilterQuery<T>): Promise<number> => {
    return await this.entityModel.count(filter);
  };

  find = async (
    filter: FilterQuery<T>,
    pages = 1,
    limitPages = 20,
    sort?: any,
    projection?: Record<string, unknown>
  ): Promise<HydratedDocument<T>[]> => {
    let sortBy: string;
    // TODO: Mejorar el sorting
    const data = await this.entityModel
      .find(filter, { __v: 0, ...projection })
      .sort(sort)
      .skip((pages - 1) * limitPages)
      .limit(limitPages)
      .exec();

    if (!data.length) throw new HttpException("Empty", HttpStatus.NO_CONTENT);

    return data;
  };

  findOneOrFail = async (
    filter: FilterQuery<T>,
    projection?: Record<string, unknown>
  ): Promise<HydratedDocument<T>> => {
    const data = await this.entityModel
      .findOne(filter, { __v: 0, ...projection })
      .exec();

    if (!data) throw new EntityNotFound(this.entityModel.modelName);
    return data;
  };

  findOne = async (
    filter: FilterQuery<T>,
    projection?: Record<string, unknown>
  ): Promise<HydratedDocument<T>> => {
    return await this.entityModel
      .findOne(filter, { __v: 0, ...projection })
      .exec();
  };

  findAndCountOrFail = async (filter: FilterQuery<T>): Promise<number> => {
    return await this.entityModel.countDocuments(filter).exec();
  };

  createEntity = async (createEntityData: unknown): Promise<Document<T>> => {
    const entity = new this.entityModel(createEntityData);
    return await entity.save();
  };

  findOrCreate = async (
    filter: FilterQuery<T>,
    projection?: Record<string, unknown>
  ): Promise<Document<T>> => {
    const data = await this.entityModel
      .findOne(filter, { __v: 0, ...projection })
      .exec();

    if (!data) {
      const entity = new this.entityModel(filter);

      return await entity.save();
    }
    return data;
  };

  updateEntityOrFail = async (
    filter: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
    options?: QueryOptions
  ): Promise<T> => {
    const data = await this.entityModel
      .findOneAndUpdate(filter, updateEntityData, {
        new: true,
        ...options,
      })
      .exec();
    if (!data) throw new EntityNotFound(this.entityModel.modelName);
    return data;
  };

  updateEntity = async (
    filter: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
    options?: QueryOptions
  ): Promise<T> => {
    return await this.entityModel
      .findOneAndUpdate(filter, updateEntityData, {
        new: true,
        ...options,
      })
      .exec();
  };

  deleteEntity = async (filter: FilterQuery<T>): Promise<boolean> => {
    const data = await this.entityModel.softDelete(filter);
    if (!data) throw new EntityNotFound(this.entityModel.modelName);
    return data;
  };

  restoreEntity = async (filter: FilterQuery<T>): Promise<boolean> => {
    const data = await this.entityModel.restore(filter);
    if (!data) throw new EntityNotFound(this.entityModel.modelName);
    return data;
  };
}
