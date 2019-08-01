from cryptography.fernet import Fernet

key = 'TluxwB3fV_GWuLkR1_BzGs1Zk90TYAuhNMZP_0q4WyM='

# Oh no! The code is going over the edge! What are you going to do?
message = b'gAAAAABdQfLcMp9uAkbMsyge_j36v6x-ldzPLB8byXMZ5zQHOiLu-wMcc-wMWcddAqdarL9WNaVRdd_HFiYh4mAkXcIHlU_dvjX8rWIkCzO0D0f9DNAUPCvqcxZJFjZPsm70zeSoOs2ohTrPv4I1J4Sbiar43qnEWdxlDEWpDqY6Rp-Tm55rn9c='

def main():
    f = Fernet(key)
    print(f.decrypt(message))


if __name__ == "__main__":
    main()
