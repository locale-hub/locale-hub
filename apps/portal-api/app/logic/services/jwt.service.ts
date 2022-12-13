import * as jose from 'jose';
import {JWTPayload} from 'jose/dist/types/types';
import {GenerateKeyPairResult} from 'jose';
import { environment } from '../../../environments/environment';

const algorithm = 'EdDSA' as const;
const crv = 'Ed25519' as const;

class JwtService {
  private static _instance: JwtService;
  static instance = () => {
    if (undefined === JwtService._instance) {
      JwtService._instance = new JwtService();
    }
    return JwtService._instance;
  }

  private __keyPair?: GenerateKeyPairResult = undefined;
  private async keyPair(): Promise<GenerateKeyPairResult> {
    if (undefined === this.__keyPair) {
      this.__keyPair = await jose.generateKeyPair(algorithm, {crv: crv});
    }
    return this.__keyPair;
  }

  async sign<TPayload extends JWTPayload>(payload: TPayload): Promise<string> {
    const kp = await this.keyPair();

    return await new jose.SignJWT(payload)
      .setProtectedHeader({alg: algorithm})
      .setIssuedAt()
      .setIssuer(environment.security.jwt.issuer)
      .setAudience(environment.security.jwt.audience)
      .setExpirationTime(environment.security.jwt.expiresIn)
      .sign(kp.privateKey);
  }

  async read<TModel>(jwt: string): Promise<TModel> {
    const kp = await this.keyPair();

    const {payload} = await jose.jwtVerify(jwt, kp.publicKey, {
      issuer: environment.security.jwt.issuer,
      audience: environment.security.jwt.audience,
      algorithms: [algorithm],
    });

    // as unknown to remove the JWTPayload dependency
    return payload as unknown as TModel;
  }
}

export const jwtService = JwtService.instance();
