import request = require('supertest');
import express = require('express');
import { expect } from 'chai';
import {inject, injectable} from 'tsyringe';
import {Route} from "../decorators/Route";
import {Response} from "express";
import tokens from "../tokens";
import {IRouteHandler} from "../models/IRouteHandler";
import {publish} from "./publish";
import {ParentContainer} from "../mocks/ParentContainer";

describe('publish', function() {
  this.timeout(0);
  let app, container;

  beforeEach(function() {
    app = express();
    container = new ParentContainer();
  });

  it('should use the result of the handler as the content of the response', async function() {
    @injectable()
    @Route('GET', '/return-as-response')
    class CUT {
      handle() {
        return { message:'Victory!' };
      }
    }

    publish(app, container);
    const result = await request(app).get('/return-as-response');

    debugger;
    expect(result.body.message).to.equal('Victory!');
  });

  it('should use HTTPResponse class for more precise control over response', async function() {
    @injectable()
    @Route('GET', '/http-response-response')
    class CUT {
      handle() {
        return {
          statusCode: 400,
          contentType:'text/plain',
          body: 'This is simple text'
        };
      }
    }

    publish(app, container);
    const result = await request(app).get('/http-response-response');

    expect(result.statusCode).to.equal(400);
    expect(result.type).to.equal('text/plain');
    expect(result.text).to.equal('This is simple text');
  });

  it('should be able to use traditional request object for traditional handling', async function() {
    @injectable()
    @Route('GET', '/traditional-response')
    class CUT {
      constructor(
        @inject(tokens.Response) private response:Response
      ) {}

      handle() {
        this.response.status(400).contentType('text/plain').send('This is simple text');
      }
    }

    publish(app, container);
    const result = await request(app).get('/traditional-response');

    expect(result.statusCode).to.equal(400);
    expect(result.type).to.equal('text/plain');
    expect(result.text).to.equal('This is simple text');
  });

  it('should allow ability to handle error and return a response', async function() {
    @injectable()
    @Route('GET', '/traditional-response')
    class CUT implements IRouteHandler<any, any>{
      constructor(
        @inject(tokens.Response) private response:Response
      ) {}

      handle() {
        throw new Error('Oh no!');
      }

      catch(err: Error): IHTTPResponse<string>{
        return {
          statusCode:500,
          contentType:'text/plain',
          body:'Internal Server Error'
        };
      }
    }

    publish(app, container);
    const result = await request(app).get('/traditional-response');

    expect(result.statusCode).to.equal(500);
    expect(result.text).to.equal('Internal Server Error');
  });
});